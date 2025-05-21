alter table "public"."book_reading_logs" drop constraint "book_reading_logs_book_id_fkey";

alter table "public"."book_reading_logs" drop constraint "book_reading_logs_user_id_fkey";

alter table "public"."authors" enable row level security;

alter table "public"."book_authors" enable row level security;

alter table "public"."book_notes" enable row level security;

alter table "public"."book_reading_logs" enable row level security;

alter table "public"."book_reviews" enable row level security;

alter table "public"."book_status_history" enable row level security;

alter table "public"."books" enable row level security;

alter table "public"."user_activity" enable row level security;

alter table "public"."user_books" enable row level security;

alter table "public"."user_searches" enable row level security;

alter table "public"."book_reading_logs" add constraint "book_reading_logs_book_id_fkey" FOREIGN KEY (book_id) REFERENCES books(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."book_reading_logs" validate constraint "book_reading_logs_book_id_fkey";

alter table "public"."book_reading_logs" add constraint "book_reading_logs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."book_reading_logs" validate constraint "book_reading_logs_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_book_reading_log(reading_log_data jsonb, user_id uuid, book_id text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
    reading_log_id TEXT;
BEGIN
    -- Insert reading log data
    reading_log_id := generate_prefixed_id('brl');

    INSERT INTO book_reading_logs (
        id,
        book_id,
        user_id,
        audio_start_time,
        audio_end_time,
        start_page,
        end_page,
        current_percentage,
        note,
        created_at,
        date,
        format
    )
    VALUES (
        reading_log_id,
        book_id,
        user_id,
        (reading_log_data ->> 'audio_start_time')::NUMERIC,
        (reading_log_data ->> 'audio_end_time')::NUMERIC,
        (reading_log_data ->> 'start_page')::INTEGER,
        (reading_log_data ->> 'end_page')::INTEGER,
        (reading_log_data ->> 'current_percentage')::INTEGER,
        reading_log_data ->> 'note',
        COALESCE((reading_log_data ->> 'created_at')::TIMESTAMPTZ, NOW()),
        COALESCE((reading_log_data ->> 'date')::TIMESTAMPTZ, NOW()),
        ARRAY[(reading_log_data ->> 'format')::book_format_enum]
    );

    RETURN reading_log_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.add_book_to_library(book_data jsonb, book_status_history_data jsonb, user_books_data jsonb, user_id uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  book_id TEXT;
  existing_book_id TEXT;
  status_history_id TEXT;
  reading_log_id TEXT;
BEGIN
    --First check if book exists in database
    IF(book_data ->> 'id') IS NOT NULL THEN
    book_id:= book_data ->> 'id';
    ELSE
    SELECT id INTO existing_book_id
    FROM books
    WHERE api_id = book_data ->> 'api_id'
    LIMIT 1;

    book_id:= existing_book_id;
    END IF;

    --If book doesn't exist, create it
    IF book_id IS NULL THEN
    book_id:= store_book_with_authors(book_data);
    END IF;

    --Add book to user's library with simplified fields
    INSERT INTO user_books(
    book_id,
    user_id,
    date_added,
    format,
    genres,
    rating,
    target_completion_date,
    total_duration,
    total_pages,
    cover_image_url
    )
    VALUES(
    book_id,
    user_id,
    COALESCE((user_books_data ->> 'date_added')::TIMESTAMP, NOW()),
    ARRAY(SELECT jsonb_array_elements_text(user_books_data -> 'format'))::book_format_enum[],
    (SELECT ARRAY(SELECT jsonb_array_elements_text(book_data -> 'genres'))),
    (user_books_data ->> 'rating')::NUMERIC,
    (user_books_data ->> 'target_completion_date')::TIMESTAMP,
    (user_books_data ->> 'total_duration')::NUMERIC,
    (user_books_data ->> 'total_pages')::INTEGER,
    user_books_data ->> 'cover_image_url'
    );

    --Add initial status history
    status_history_id:= generate_prefixed_id('bsh');
    
    INSERT INTO book_status_history(
    id,
    book_id,
    user_id,
    status,
    created_at
    )
    VALUES(
    status_history_id,
    book_id,
    user_id,
    (book_status_history_data ->> 'status')::book_status_enum,
    COALESCE((user_books_data ->> 'start_date')::TIMESTAMP, NOW())
    );

  -- Create initial reading log if metrics are provided
  IF (user_books_data->>'current_audio_time') IS NOT NULL OR 
     (user_books_data->>'current_page') IS NOT NULL OR 
     (user_books_data->>'current_percentage') IS NOT NULL THEN
    
    reading_log_id := generate_prefixed_id('brl');
    
    -- Updated book_reading_logs insertion with format-based logic
    INSERT INTO book_reading_logs(
    id,
    book_id,
    user_id,
    audio_start_time,
    audio_end_time,
    start_page,
    end_page,
    current_percentage,
    note,
    created_at,
    date,
    format
    )
    VALUES(
    reading_log_id,
    book_id,
    user_id,
    -- Audio start time = 0 if audio format and end time provided
    CASE WHEN (user_books_data -> 'format')::jsonb ? 'audio' 
        AND (user_books_data ->> 'current_audio_time') IS NOT NULL 
        THEN 0 ELSE NULL END,
    -- Audio end time only for audio formats
    CASE WHEN (user_books_data -> 'format')::jsonb ? 'audio' 
        THEN (user_books_data ->> 'current_audio_time')::NUMERIC 
        ELSE NULL END,
    -- Page tracking
    CASE WHEN NOT (user_books_data -> 'format')::jsonb <@ '["audio"]'::jsonb 
        AND (user_books_data ->> 'current_page') IS NOT NULL 
        THEN 0 ELSE NULL END,
    CASE WHEN NOT (user_books_data -> 'format')::jsonb <@ '["audio"]'::jsonb 
        THEN (user_books_data ->> 'current_page')::INTEGER 
        ELSE NULL END,
    COALESCE((user_books_data ->> 'current_percentage')::INTEGER, 0),
    user_books_data ->> 'note',
    NOW(),
    NOW()::DATE,
    ARRAY(SELECT jsonb_array_elements_text(user_books_data -> 'format'))::book_format_enum[]
    );

  END IF;

  RETURN book_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error adding book to library: %', SQLERRM;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_book_current_state_fn(p_user_id uuid, p_book_id text)
 RETURNS TABLE(title text, description text, user_id uuid, book_id text, format book_format_enum[], rating numeric, target_completion_date timestamp with time zone, date_added timestamp with time zone, cover_image_url text, total_pages integer, total_duration numeric, genres text[], current_status book_status_enum, status_changed_at timestamp with time zone, current_percentage numeric, current_audio_time numeric, current_page integer, latest_note text)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        b.title,
        b.description,
        ub.user_id,
        ub.book_id,
        ub.format,
        ub.rating,
        ub.target_completion_date,
        ub.date_added,
        COALESCE(ub.cover_image_url, b.cover_image_url) AS cover_image_url,
        COALESCE(ub.total_pages, b.total_pages) AS total_pages,
        COALESCE(ub.total_duration, b.total_duration) AS total_duration,
        COALESCE(ub.genres, b.genres) AS genres,
        latest_status.status AS current_status,
        latest_status.created_at AS status_changed_at,
        latest_log.current_percentage,
        latest_log.audio_end_time AS current_audio_time,
        latest_log.end_page AS current_page,
        latest_log.note AS latest_note
    FROM
        user_books ub
    JOIN
        books b ON ub.book_id = b.id
    LEFT JOIN LATERAL (
        SELECT bsh.status, bsh.created_at
        FROM book_status_history bsh
        WHERE bsh.book_id = ub.book_id AND bsh.user_id = ub.user_id
        ORDER BY bsh.created_at DESC
        LIMIT 1
    ) latest_status ON true
    LEFT JOIN LATERAL (
        SELECT brl.current_percentage, brl.audio_end_time, brl.end_page, brl.note
        FROM book_reading_logs brl
        WHERE brl.book_id = ub.book_id AND brl.user_id = ub.user_id
        ORDER BY brl.created_at DESC
        LIMIT 1
    ) latest_log ON true
    WHERE
        ub.user_id = p_user_id AND ub.book_id = p_book_id::TEXT;
END;
$function$
;

create policy "Enable read access for all users"
on "public"."authors"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."book_authors"
as permissive
for select
to public
using (true);


create policy "Enable delete for users based on user_id"
on "public"."book_notes"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for authenticated users only"
on "public"."book_notes"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable users to view their own data only"
on "public"."book_notes"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable delete for users based on user_id"
on "public"."book_reading_logs"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for users based on user_id"
on "public"."book_reading_logs"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to view their own data only"
on "public"."book_reading_logs"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "update their own data"
on "public"."book_reading_logs"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for authenticated users only"
on "public"."book_reviews"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."book_reviews"
as permissive
for select
to public
using (true);


create policy "Enable insert for authenticated users only"
on "public"."book_status_history"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable users to view their own data only"
on "public"."book_status_history"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "update their own bsh"
on "public"."book_status_history"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable read access for all users"
on "public"."books"
as permissive
for select
to public
using (true);


create policy "Enable users to view their own data only"
on "public"."user_activity"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "service roll insert"
on "public"."user_activity"
as permissive
for insert
to service_role
with check (true);


create policy "Enable users to view their own data only"
on "public"."user_books"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable delete for users based on user_id"
on "public"."user_searches"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for authenticated users only"
on "public"."user_searches"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable users to view their own data only"
on "public"."user_searches"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



