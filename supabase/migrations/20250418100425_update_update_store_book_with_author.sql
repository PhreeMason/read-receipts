ALTER TABLE books 
  ADD CONSTRAINT unique_api_id UNIQUE (api_id),
  ALTER COLUMN created_at SET DEFAULT NOW(),
  ALTER COLUMN updated_at SET DEFAULT NOW();

CREATE OR REPLACE FUNCTION store_book_with_authors(
    book_data JSONB
) RETURNS void AS $$
DECLARE
    inserted_book_id TEXT;
    author_id TEXT;
    author_name TEXT;
BEGIN
    -- Insert book data first
    INSERT INTO books (
        api_id, api_source, cover_image_url, created_at, date_added, 
        description, edition, format, genres, id, isbn10, isbn13, 
        language, metadata, publication_date, publisher, rating, 
        title, total_duration, total_pages, updated_at
    ) VALUES (
        book_data->>'api_id',
        book_data->>'api_source',
        book_data->>'cover_image_url',
        COALESCE((book_data->>'created_at')::TIMESTAMPTZ, NOW()),
        COALESCE((book_data->>'date_added')::TIMESTAMPTZ, NOW()), 
        book_data->>'description',
        book_data->'edition',
        (book_data->>'format')::book_format_enum,
        book_data->'genres',
        COALESCE(book_data->>'id', generate_prefixed_id('book')),
        book_data->>'isbn10',
        book_data->>'isbn13',
        book_data->>'language',
        book_data->'metadata',
        book_data->>'publication_date',
        book_data->>'publisher',
        (book_data->>'rating')::NUMERIC,
        book_data->>'title',
        (book_data->>'total_duration')::INTEGER,
        (book_data->>'total_pages')::INTEGER,
        NOW()
    )
    ON CONFLICT (api_id) 
    DO UPDATE SET
        cover_image_url = EXCLUDED.cover_image_url,
        description = EXCLUDED.description,
        genres = EXCLUDED.genres,
        metadata = EXCLUDED.metadata,
        rating = EXCLUDED.rating,
        updated_at = NOW()::TEXT
    RETURNING id INTO inserted_book_id;
    
    -- Process authors if they exist
    IF book_data->'metadata'->'authors' IS NOT NULL AND jsonb_array_length(book_data->'metadata'->'authors') > 0 THEN
        -- For each author in the array
        FOR author_name IN SELECT jsonb_array_elements_text(book_data->'metadata'->'authors')
        LOOP
            -- Upsert author and get ID
            INSERT INTO authors (name, id)
            VALUES (author_name, generate_prefixed_id('auth'))
            ON CONFLICT (name) 
            DO NOTHING
            RETURNING id INTO author_id;
            
            -- If no ID was returned (author already existed), get the existing ID
            IF author_id IS NULL THEN
                SELECT id INTO author_id FROM authors WHERE name = author_name;
            END IF;
            
            -- Now create the relationship in book_authors
            INSERT INTO book_authors (book_id, author_id)
            VALUES (inserted_book_id, author_id)
            ON CONFLICT (book_id, author_id) 
            DO NOTHING;
        END LOOP;
    END IF;
END;
$$ LANGUAGE plpgsql;
