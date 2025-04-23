CREATE OR REPLACE FUNCTION get_books_by_status(p_status book_status_enum, p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    result JSONB;
BEGIN
    -- Find books with the specified status
    WITH relevant_books AS (
        SELECT DISTINCT b.id
        FROM books b
        JOIN user_books ub ON b.id = ub.book_id AND ub.user_id = p_user_id
        JOIN book_status_history bsh ON b.id = bsh.book_id 
            AND bsh.user_id = p_user_id 
            AND bsh.status = p_status
    )
    SELECT 
        jsonb_agg(book_data) INTO result
    FROM (
        SELECT
            jsonb_build_object(
                'id', b.id,
                'title', b.title,
                'api_id', b.api_id,
                'api_source', b.api_source,
                'cover_image_url', b.cover_image_url,
                'created_at', b.created_at,
                'description', b.description,
                'edition', b.edition,
                'format', b.format,
                'genres', b.genres,
                'isbn10', b.isbn10,
                'isbn13', b.isbn13,
                'language', b.language,
                'metadata', b.metadata,
                'publication_date', b.publication_date,
                'publisher', b.publisher,
                'rating', b.rating,
                'total_duration', b.total_duration,
                'total_pages', b.total_pages,
                'updated_at', b.updated_at,
                'user_book', COALESCE(
                    (
                        SELECT jsonb_agg(to_jsonb(ub))
                        FROM user_books ub
                        WHERE ub.book_id = b.id AND ub.user_id = p_user_id
                    ),
                    '[]'::jsonb
                ),
                'authors', COALESCE(
                    (
                        SELECT jsonb_agg(to_jsonb(a))
                        FROM authors a
                        JOIN book_authors ba ON a.id = ba.author_id
                        WHERE ba.book_id = b.id
                    ),
                    '[]'::jsonb
                ),
                'status', COALESCE(
                    (
                        SELECT jsonb_agg(to_jsonb(s))
                        FROM (
                            SELECT status, created_at
                            FROM book_status_history
                            WHERE book_id = b.id AND user_id = p_user_id
                            ORDER BY created_at DESC
                            LIMIT 1
                        ) s
                    ),
                    '[]'::jsonb
                ),
                'log', COALESCE(
                    (
                        SELECT jsonb_agg(to_jsonb(l))
                        FROM (
                            SELECT *
                            FROM book_reading_logs
                            WHERE book_id = b.id AND user_id = p_user_id
                            ORDER BY created_at DESC
                            LIMIT 1
                        ) l
                    ),
                    '[]'::jsonb
                ),
                'review', COALESCE(
                    (
                        SELECT jsonb_agg(to_jsonb(r))
                        FROM (
                            SELECT *
                            FROM book_reviews
                            WHERE book_id = b.id AND user_id = p_user_id
                            ORDER BY created_at DESC
                            LIMIT 1
                        ) r
                    ),
                    '[]'::jsonb
                ),
                'note', COALESCE(
                    (
                        SELECT jsonb_agg(to_jsonb(n))
                        FROM (
                            SELECT *
                            FROM book_notes
                            WHERE book_id = b.id AND user_id = p_user_id
                            ORDER BY created_at DESC
                            LIMIT 1
                        ) n
                    ),
                    '[]'::jsonb
                )
            ) AS book_data
        FROM books b
        JOIN relevant_books rb ON b.id = rb.id
        LIMIT 100
    ) subquery;

    -- Ensure we return an empty array instead of null if no results
    RETURN COALESCE(result, '[]'::jsonb);
END;
$$;
