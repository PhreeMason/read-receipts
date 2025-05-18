CREATE OR REPLACE FUNCTION add_book_to_library(
  book_data JSONB,
  book_status_history_data JSONB,
  user_books_data JSONB,
  user_id UUID
) RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;