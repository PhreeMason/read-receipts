-- For user_searches table
CREATE TRIGGER set_user_search_id_trigger
BEFORE INSERT ON user_searches
FOR EACH ROW
EXECUTE FUNCTION set_user_search_id();