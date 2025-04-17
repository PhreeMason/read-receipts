-- Create authors table
CREATE TABLE authors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- Create books table
CREATE TABLE books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  api_id TEXT,
  api_source TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  date_added TIMESTAMP WITH TIME ZONE,
  description TEXT,
  edition JSONB,
  format book_format_enum,
  genres TEXT[],
  isbn10 TEXT,
  isbn13 TEXT,
  language TEXT,
  metadata JSONB,
  publication_date TIMESTAMP WITH TIME ZONE,
  publisher TEXT,
  rating NUMERIC,
  total_duration NUMERIC,
  total_pages INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create book_authors junction table
CREATE TABLE book_authors (
  author_id TEXT NOT NULL,
  book_id TEXT NOT NULL,
  PRIMARY KEY (author_id, book_id),
  FOREIGN KEY (author_id) REFERENCES authors(id),
  FOREIGN KEY (book_id) REFERENCES books(id)
);

-- Create user_searches table
CREATE TABLE user_searches (
  id TEXT PRIMARY KEY,
  query TEXT NOT NULL,
  result_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  user_id uuid NOT NULL,
  FOREIGN KEY (user_id) REFERENCES profiles(id)
);

-- Create user_books table
CREATE TABLE user_books (
  completion_date TIMESTAMP WITH TIME ZONE,
  cover_image_url TEXT,
  date_added TIMESTAMP WITH TIME ZONE,
  format book_format_enum[],
  genres TEXT[],
  rating NUMERIC,
  status book_status_enum,
  target_completion_date TIMESTAMP WITH TIME ZONE,
  total_duration NUMERIC,
  total_pages INTEGER,
  user_id uuid,
  book_id TEXT,
  notes TEXT,
  PRIMARY KEY (user_id, book_id),
  FOREIGN KEY (book_id) REFERENCES books(id),
  FOREIGN KEY (user_id) REFERENCES profiles(id)
);

CREATE TABLE book_reviews (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL,
  user_id uuid NOT NULL,
  rating NUMERIC,
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (book_id) REFERENCES books(id),
  FOREIGN KEY (user_id) REFERENCES profiles(id)
);

CREATE TABLE book_notes (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL,
  user_id uuid NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (book_id) REFERENCES books(id),
  FOREIGN KEY (user_id) REFERENCES profiles(id)
);

CREATE TABLE book_reading_logs (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL,
  user_id uuid NOT NULL,
  format book_format_enum[],
  date TIMESTAMP WITH TIME ZONE,
  audio_start_time NUMERIC,
  audio_end_time NUMERIC,
  listening_speed NUMERIC,
  duration NUMERIC,
  start_page INTEGER,
  end_page INTEGER,
  pages_read INTEGER,
  rating NUMERIC,
  notes TEXT,
  emotional_state TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (book_id) REFERENCES books(id),
  FOREIGN KEY (user_id) REFERENCES profiles(id)
);

-- Create book_status_history table
CREATE TABLE book_status_history (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL,
  user_id uuid NOT NULL,
  status book_status_enum,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (book_id) REFERENCES books(id),
  FOREIGN KEY (user_id) REFERENCES profiles(id)
);