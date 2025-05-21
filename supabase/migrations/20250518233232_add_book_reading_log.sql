CREATE OR REPLACE FUNCTION add_book_reading_log(
    reading_log_data jsonb,
    user_id uuid,
    book_id TEXT
) RETURNS TEXT AS $$
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
        format,
        emotional_state,
        listening_speed,
        rating,
        reading_location
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
        (SELECT ARRAY(SELECT jsonb_array_elements_text(reading_log_data->'format')::book_format_enum)),
        (SELECT ARRAY(SELECT jsonb_array_elements_text(reading_log_data->'emotional_state'))),
        (reading_log_data ->> 'listening_speed')::NUMERIC,
        (reading_log_data ->> 'rating')::INTEGER,
        reading_log_data ->> 'reading_location'
    );

    RETURN reading_log_id;
END;
$$ LANGUAGE plpgsql;