-- Create custom enumeration types
CREATE TYPE book_format_enum AS ENUM ('physical', 'ebook', 'audio');

CREATE TYPE book_status_enum AS ENUM (
  'tbr', 
  'current', 
  'completed', 
  'dnf', 
  'pause'
);
