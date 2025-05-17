ALTER TABLE public.book_reading_logs 
  ALTER COLUMN emotional_state TYPE text[]
  USING ARRAY[emotional_state];

ALTER TABLE public.book_reading_logs 
  ADD COLUMN reading_location text NULL;

ALTER TABLE public.book_reading_logs 
  RENAME COLUMN notes TO note;
