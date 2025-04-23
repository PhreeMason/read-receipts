CREATE TABLE public.user_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT NULL
);

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
    record_id,
    activity_type,
    metadata
  ) VALUES (
    NEW.user_id,
    TG_TABLE_NAME,
    CASE 
      WHEN TG_TABLE_NAME = 'book_notes' THEN NEW.id
      WHEN TG_TABLE_NAME = 'book_reading_logs' THEN NEW.id
      WHEN TG_TABLE_NAME = 'book_reviews' THEN NEW.id
      WHEN TG_TABLE_NAME = 'book_status_history' THEN NEW.id
    END,
    'created',
    meta_data
  );
  
  RETURN NEW;
END;
$$;

-- Trigger for book_notes table
CREATE TRIGGER on_book_note_created
AFTER INSERT ON public.book_notes
FOR EACH ROW EXECUTE FUNCTION public.log_user_activity();

-- Trigger for book_reading_logs table
CREATE TRIGGER on_book_reading_log_created
AFTER INSERT ON public.book_reading_logs
FOR EACH ROW EXECUTE FUNCTION public.log_user_activity();

-- Trigger for book_reviews table
CREATE TRIGGER on_book_review_created
AFTER INSERT ON public.book_reviews
FOR EACH ROW EXECUTE FUNCTION public.log_user_activity();

-- Trigger for book_status_history table
CREATE TRIGGER on_book_status_history_created
AFTER INSERT ON public.book_status_history
FOR EACH ROW EXECUTE FUNCTION public.log_user_activity();
