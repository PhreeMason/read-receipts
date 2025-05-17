-- 3. Add indexes to improve query performance
CREATE INDEX idx_book_reading_logs_user_book 
ON book_reading_logs(user_id, book_id, created_at DESC);

CREATE INDEX idx_book_status_history_user_book 
ON book_status_history(user_id, book_id, created_at DESC);

-- 4. Clean up old user_books data
ALTER TABLE user_books
    DROP COLUMN current_audio_time,
    DROP COLUMN current_page,
    DROP COLUMN completion_date,
    DROP COLUMN start_date,
    DROP COLUMN note;

-- 5. Create views for easier access to reading logs and status history
CREATE OR REPLACE VIEW user_book_current_state AS
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
    SELECT status, created_at
    FROM book_status_history
    WHERE book_id = ub.book_id AND user_id = ub.user_id
    ORDER BY created_at DESC
    LIMIT 1
) latest_status ON true
LEFT JOIN LATERAL (
    SELECT current_percentage, audio_end_time, end_page, note
    FROM book_reading_logs
    WHERE book_id = ub.book_id AND user_id = ub.user_id
    ORDER BY created_at DESC
    LIMIT 1
) latest_log ON true;

-- 6. Update the add_book_to_library Function

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

  -- Add book to user's library with simplified fields
  INSERT INTO user_books (
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
  VALUES (
    book_id,
    user_id,
    COALESCE((user_books_data->>'date_added')::TIMESTAMP, NOW()),
    ARRAY(SELECT jsonb_array_elements_text(user_books_data->'format'))::book_format_enum[],
    (SELECT ARRAY(SELECT jsonb_array_elements_text(book_data->'genres'))),
    (user_books_data->>'rating')::NUMERIC,
    (user_books_data->>'target_completion_date')::TIMESTAMP,
    (user_books_data->>'total_duration')::NUMERIC,
    (user_books_data->>'total_pages')::INTEGER,
    user_books_data->>'cover_image_url'
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
    COALESCE((user_books_data->>'start_date')::TIMESTAMP, NOW())
  );

  -- Create initial reading log if metrics are provided
  IF (user_books_data->>'current_audio_time') IS NOT NULL OR 
     (user_books_data->>'current_page') IS NOT NULL OR 
     (user_books_data->>'current_percentage') IS NOT NULL THEN
    
    reading_log_id := generate_prefixed_id('brl_');
    
    INSERT INTO book_reading_logs (
      id,
      book_id,
      user_id,
      audio_end_time,
      current_percentage,
      end_page,
      note,
      created_at,
      date
    )
    VALUES (
      reading_log_id,
      book_id,
      user_id,
      (user_books_data->>'current_audio_time')::NUMERIC,
      (user_books_data->>'current_percentage')::INTEGER,
      (user_books_data->>'current_page')::INTEGER,
      user_books_data->>'note',
      NOW(),
      NOW()::DATE
    );
  END IF;

  RETURN book_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error adding book to library: %', SQLERRM;
END;
$$;

-- 7. Create Function to get current reading progress
CREATE OR REPLACE FUNCTION get_reading_progress(p_user_id UUID, p_book_id TEXT)
RETURNS TABLE (
    current_percentage INTEGER,
    current_page INTEGER,
    current_audio_time NUMERIC,
    last_updated TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        brl.current_percentage,
        brl.end_page,
        brl.audio_end_time,
        brl.created_at
    FROM book_reading_logs brl
    WHERE brl.user_id = p_user_id AND brl.book_id = p_book_id
    ORDER BY brl.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;
