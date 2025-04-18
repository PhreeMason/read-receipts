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
BEGIN
  -- First check if book exists in database
  IF (book_data->>'id') IS NOT NULL THEN
    book_id := book_data->>'id';
  ELSE
    SELECT id INTO existing_book_id
    FROM books
    WHERE api_id = book_data->>'api_id'
    LIMIT 1;
    
    book_id := existing_book_id;
  END IF;

  -- If book doesn't exist, create it
  IF book_id IS NULL THEN
    book_id := store_book_with_authors(book_data);
  END IF;

  -- Add book to user's library
  INSERT INTO user_books (
    book_id,
    user_id,
    completion_date,
    cover_image_url,
    current_audio_time,
    current_page,
    date_added,
    format,
    genres,
    note,
    rating,
    start_date,
    target_completion_date,
    total_duration,
    total_pages,
    current_percentage
  )
  VALUES (
    book_id,
    user_id,
    (user_books_data->>'completion_date')::TIMESTAMP,
    user_books_data->>'cover_image_url',
    (user_books_data->>'current_audio_time')::NUMERIC,
    (user_books_data->>'current_page')::INTEGER,
    COALESCE((user_books_data->>'date_added')::TIMESTAMP, NOW()),
    ARRAY(SELECT jsonb_array_elements_text(user_books_data->'format'))::book_format_enum[],
    (SELECT ARRAY(SELECT jsonb_array_elements_text(book_data->'genres'))),
    user_books_data->>'note',
    (user_books_data->>'rating')::NUMERIC,
    (user_books_data->>'start_date')::TIMESTAMP,
    (user_books_data->>'target_completion_date')::TIMESTAMP,
    (user_books_data->>'total_duration')::NUMERIC,
    (user_books_data->>'total_pages')::INTEGER,
    (user_books_data->>'currentPercentage')::INTEGER
  );

  -- Add initial status history
  status_history_id := generate_prefixed_id('bsh_');
  
  INSERT INTO book_status_history (
    id,
    book_id,
    user_id,
    status,
    created_at
  )
  VALUES (
    status_history_id,
    book_id,
    user_id,
    (book_status_history_data->>'status')::book_status_enum,
    NOW()
  );

  RETURN book_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error adding book to library: %', SQLERRM;
END;
$$;
