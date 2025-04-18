-- remove status from user_books
-- add current_page and current_time to user_books measured in minutes
ALTER TABLE user_books
DROP COLUMN status,
ADD COLUMN current_page INT DEFAULT 0,
ADD COLUMN current_audio_time INT DEFAULT 0;