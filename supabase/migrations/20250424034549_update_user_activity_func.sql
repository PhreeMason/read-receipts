CREATE OR REPLACE FUNCTION public.log_user_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  meta_data JSONB;
BEGIN
  -- Create base metadata with common fields
  meta_data := jsonb_build_object(
    'book_id', NEW.book_id,
    'created_at', COALESCE(NEW.created_at, now())
  );
  
  -- Add table-specific metadata
  IF TG_TABLE_NAME = 'book_notes' THEN
    meta_data := meta_data || jsonb_build_object('note', NEW.note);
  ELSIF TG_TABLE_NAME = 'book_reading_logs' THEN
    meta_data := meta_data || jsonb_build_object(
      'format', NEW.format,
      'pages_read', NEW.pages_read,
      'duration', NEW.duration
    );
  ELSIF TG_TABLE_NAME = 'book_reviews' THEN
    meta_data := meta_data || jsonb_build_object(
      'rating', NEW.rating,
      'review', substring(NEW.review, 1, 100) -- Include just a preview
    );
  ELSIF TG_TABLE_NAME = 'book_status_history' THEN
    meta_data := meta_data || jsonb_build_object('status', NEW.status);
  END IF;
  
  -- Insert the activity record
  INSERT INTO public.user_activity (
    user_id,
    table_name,
    book_id,
    record_id,
    activity_type,
    metadata
  ) VALUES (
    NEW.user_id,
    TG_TABLE_NAME,
    NEW.book_id,
    NEW.id,
    'created',
    meta_data
  );
  
  RETURN NEW;
END;
$$;