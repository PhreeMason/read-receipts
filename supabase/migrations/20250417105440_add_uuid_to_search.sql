-- For user_searches table
CREATE OR REPLACE FUNCTION public.set_user_search_id()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.id := generate_prefixed_id('search');
    RETURN NEW;
END;
$$;