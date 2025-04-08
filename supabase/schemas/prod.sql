


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."annotation_type" AS ENUM (
    'highlight',
    'mark',
    'underline'
);


ALTER TYPE "public"."annotation_type" OWNER TO "postgres";


CREATE TYPE "public"."book_format_enum" AS ENUM (
    'physical',
    'ebook',
    'audio'
);


ALTER TYPE "public"."book_format_enum" OWNER TO "postgres";


CREATE TYPE "public"."book_source_enum" AS ENUM (
    'api',
    'user_created',
    'goodreads',
    'googlebooks'
);


ALTER TYPE "public"."book_source_enum" OWNER TO "postgres";


CREATE TYPE "public"."book_status" AS ENUM (
    'to-read',
    'reading',
    'read',
    'did-not-finish'
);


ALTER TYPE "public"."book_status" OWNER TO "postgres";


CREATE TYPE "public"."book_status_enum" AS ENUM (
    'tbr',
    'current',
    'completed',
    'dnf',
    'pause'
);


ALTER TYPE "public"."book_status_enum" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_profile"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.profiles (id, full_name, username, avatar_url)
  values (new.id, 
         new.raw_user_meta_data->>'full_name', 
         new.raw_user_meta_data->>'username', 
         new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;


ALTER FUNCTION "public"."create_profile"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_prefixed_id"("prefix" "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN prefix || '_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 16);
END;
$$;


ALTER FUNCTION "public"."generate_prefixed_id"("prefix" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_status_date"("user_book_id" "uuid", "target_status" "public"."book_status") RETURNS timestamp with time zone
    LANGUAGE "sql"
    AS $_$
  select changed_at
  from user_book_status_history
  where user_book_id = $1 and status = $2
  order by changed_at asc
  limit 1;
$_$;


ALTER FUNCTION "public"."get_status_date"("user_book_id" "uuid", "target_status" "public"."book_status") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_book_status_change"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  -- Only log if status or progress changed
  if (OLD.status != NEW.status) or (OLD.reading_progress is distinct from NEW.reading_progress) then
    insert into user_book_status_history (
      user_book_id,
      status,
      progress,
      changed_at
    ) values (
      NEW.id,
      NEW.status,
      NEW.reading_progress,
      now()
    );
  end if;
  return NEW;
end;
$$;


ALTER FUNCTION "public"."log_book_status_change"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_book_id"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF NEW.id IS NULL THEN
        NEW.id := generate_prefixed_id('book');
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_book_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trigger_set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."trigger_set_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."authors" (
    "id" "text" DEFAULT "public"."generate_prefixed_id"('author'::"text") NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."authors" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."book_authors" (
    "book_id" "text" NOT NULL,
    "author_id" "text" NOT NULL
);


ALTER TABLE "public"."book_authors" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."books" (
    "id" "text" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text" NOT NULL,
    "cover_image_url" "text",
    "epub_url" "text" NOT NULL,
    "description" "text",
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "epub_path" "text",
    "source" "public"."book_source_enum" DEFAULT 'api'::"public"."book_source_enum",
    "api_id" "text",
    "api_source" "text",
    "format" "public"."book_format_enum" DEFAULT 'ebook'::"public"."book_format_enum",
    "total_pages" integer,
    "total_duration" integer,
    "isbn10" "text",
    "isbn13" "text",
    "publisher" "text",
    "publication_date" "date",
    "genres" "text"[],
    "language" "text",
    "date_added" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "rating" real,
    "edition" "jsonb" DEFAULT '{"type": null, "publisher": null, "publishDate": null}'::"jsonb",
    "has_user_edits" boolean DEFAULT false
);


ALTER TABLE "public"."books" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone,
    "username" "text",
    "full_name" "text",
    "avatar_url" "text",
    "website" "text",
    CONSTRAINT "username_length" CHECK (("char_length"("username") >= 3))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_searches" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "query" "text" NOT NULL,
    "result_count" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_searches" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."userbooks" (
    "id" "text" DEFAULT "public"."generate_prefixed_id"('book'::"text") NOT NULL,
    "user_id" "uuid",
    "format" "public"."book_format_enum" DEFAULT 'ebook'::"public"."book_format_enum",
    "total_pages" integer,
    "total_duration" integer,
    "publisher" "text",
    "publication_date" "date",
    "genres" "text"[],
    "language" "text",
    "date_added" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."book_status_enum" DEFAULT 'tbr'::"public"."book_status_enum",
    "rating" integer,
    "start_date" timestamp without time zone,
    "completion_date" timestamp without time zone,
    "target_completion_date" timestamp without time zone,
    "current_position" "jsonb" DEFAULT '{"page": null, "percentage": null, "timePosition": null}'::"jsonb",
    "edition" "jsonb" DEFAULT '{"type": null, "publisher": null, "publishDate": null}'::"jsonb",
    "cover_image_url" "text"
);


ALTER TABLE "public"."userbooks" OWNER TO "postgres";


ALTER TABLE ONLY "public"."authors"
    ADD CONSTRAINT "authors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."book_authors"
    ADD CONSTRAINT "book_authors_pkey" PRIMARY KEY ("book_id", "author_id");



ALTER TABLE ONLY "public"."books"
    ADD CONSTRAINT "books_api_id_key" UNIQUE ("api_id");



ALTER TABLE ONLY "public"."books"
    ADD CONSTRAINT "books_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."user_searches"
    ADD CONSTRAINT "user_searches_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."userbooks"
    ADD CONSTRAINT "userbooks_pkey" PRIMARY KEY ("id");



CREATE OR REPLACE TRIGGER "set_book_id_trigger" BEFORE INSERT ON "public"."books" FOR EACH ROW EXECUTE FUNCTION "public"."set_book_id"();



ALTER TABLE ONLY "public"."book_authors"
    ADD CONSTRAINT "book_authors_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id");



ALTER TABLE ONLY "public"."book_authors"
    ADD CONSTRAINT "book_authors_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_searches"
    ADD CONSTRAINT "user_searches_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."userbooks"
    ADD CONSTRAINT "userbooks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



CREATE POLICY "Authenticated users can add authors" ON "public"."authors" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can view authors" ON "public"."authors" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."books" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable read access for all users" ON "public"."books" FOR SELECT USING (true);



CREATE POLICY "Only owners can delete userBooks" ON "public"."userbooks" FOR DELETE TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Only owners can insert userBooks" ON "public"."userbooks" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Only owners can read userBooks" ON "public"."userbooks" FOR SELECT TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Only owners can update userBooks" ON "public"."userbooks" FOR UPDATE TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Users can delete their own searches" ON "public"."user_searches" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Users can insert their own searches" ON "public"."user_searches" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Users can update their own searches" ON "public"."user_searches" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Users can view their own searches" ON "public"."user_searches" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



ALTER TABLE "public"."authors" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "authors_insert_policy" ON "public"."authors" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "authors_modify_policy" ON "public"."authors" TO "anon" USING (false);



CREATE POLICY "authors_view_policy" ON "public"."authors" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."book_authors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."books" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_searches" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."userbooks" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."create_profile"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_profile"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_profile"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_prefixed_id"("prefix" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."generate_prefixed_id"("prefix" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_prefixed_id"("prefix" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_status_date"("user_book_id" "uuid", "target_status" "public"."book_status") TO "anon";
GRANT ALL ON FUNCTION "public"."get_status_date"("user_book_id" "uuid", "target_status" "public"."book_status") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_status_date"("user_book_id" "uuid", "target_status" "public"."book_status") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."log_book_status_change"() TO "anon";
GRANT ALL ON FUNCTION "public"."log_book_status_change"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_book_status_change"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_book_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_book_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_book_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."trigger_set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."trigger_set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trigger_set_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."authors" TO "anon";
GRANT ALL ON TABLE "public"."authors" TO "authenticated";
GRANT ALL ON TABLE "public"."authors" TO "service_role";



GRANT ALL ON TABLE "public"."book_authors" TO "anon";
GRANT ALL ON TABLE "public"."book_authors" TO "authenticated";
GRANT ALL ON TABLE "public"."book_authors" TO "service_role";



GRANT ALL ON TABLE "public"."books" TO "anon";
GRANT ALL ON TABLE "public"."books" TO "authenticated";
GRANT ALL ON TABLE "public"."books" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."user_searches" TO "anon";
GRANT ALL ON TABLE "public"."user_searches" TO "authenticated";
GRANT ALL ON TABLE "public"."user_searches" TO "service_role";



GRANT ALL ON TABLE "public"."userbooks" TO "anon";
GRANT ALL ON TABLE "public"."userbooks" TO "authenticated";
GRANT ALL ON TABLE "public"."userbooks" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
