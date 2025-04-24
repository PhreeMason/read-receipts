CREATE OR REPLACE FUNCTION get_user_book_activity(user_id uuid)
RETURNS TABLE (
  activity_id uuid,
  activity_created_at timestamptz,
  status_history jsonb,
  book_details jsonb
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ua.id AS activity_id,
    ua.created_at AS activity_created_at,
    jsonb_build_object(
      'status', bsh.status,
      'history_created_at', bsh.created_at
    ) AS status_history,
    jsonb_build_object(
      'title', b.title,
      'cover', b.cover_image_url,
      'authors', (
        SELECT jsonb_agg(jsonb_build_object('name', a.name))
        FROM authors a
        JOIN book_authors ba ON a.id = ba.author_id
        WHERE ba.book_id = b.id
      )
    ) AS book_details
  FROM user_activity ua
  JOIN book_status_history bsh ON ua.record_id = bsh.id
  JOIN books b ON bsh.book_id = b.id
  WHERE ua.table_name = 'book_status_history'
    AND ua.user_id = get_user_book_activity.user_id
  ORDER BY ua.created_at DESC;
END;
$$;
