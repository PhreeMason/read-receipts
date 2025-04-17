-- create function if not exists
CREATE OR REPLACE FUNCTION public.generate_prefixed_id(prefix text)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN prefix || '_' || substr(replace(gen_random_uuid():: text, '-', ''), 1, 16);
END;
$$;

-- set book id to use prefix book
CREATE OR REPLACE FUNCTION public.set_book_id()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.id := generate_prefixed_id('book');
    RETURN NEW;
END;
$$;


CREATE TRIGGER set_book_id_trigger
BEFORE INSERT ON books
FOR EACH ROW
EXECUTE FUNCTION set_book_id();
-- set author id to use prefix author
CREATE OR REPLACE FUNCTION public.set_author_id()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.id := generate_prefixed_id('author');
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_author_id_trigger
BEFORE INSERT ON authors
FOR EACH ROW
EXECUTE FUNCTION set_author_id();
