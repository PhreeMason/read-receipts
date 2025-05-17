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
CREATE OR REPLACE FUNCTION get_user_book_current_state_fn(
    p_user_id UUID,
    p_book_id TEXT
)
RETURNS TABLE (
    title TEXT,
    description TEXT,
    user_id UUID,
    book_id TEXT,
    format public.book_format_enum[],
    rating NUMERIC,
    target_completion_date TIMESTAMPTZ,
    date_added TIMESTAMPTZ,
    cover_image_url TEXT,
    total_pages INT,
    total_duration NUMERIC,
    genres TEXT[],
    current_status public.book_status_enum,
    status_changed_at TIMESTAMPTZ,
    current_percentage NUMERIC,
    current_audio_time NUMERIC,
    current_page INT,
    latest_note TEXT
)
AS $$
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
$$ LANGUAGE plpgsql;

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
