-- Habilita a extensão pgcrypto para gerar UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Habilita a extensão pgvector para trabalhar com embeddings
CREATE EXTENSION IF NOT EXISTS "vector";

-- Cria a tabela de usuários com UUID
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Cria a tabela de notas
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    is_in_trash boolean DEFAULT false,
    is_in_archive boolean DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users (id),
    CONSTRAINT chk_trash_archive CHECK (NOT (is_in_trash AND is_in_archive))
);

-- Cria a tabela de imagens associadas às notas
CREATE TABLE IF NOT EXISTS images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_id UUID,
    filename TEXT NOT NULL,
    status TEXT DEFAULT 'unprocessed',
    description TEXT, 
    CONSTRAINT fk_note_id FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS urls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_id UUID NOT NULL,
    url TEXT NOT NULL,
    status TEXT DEFAULT 'unprocessed',
    transcription TEXT, 
    summary TEXT,
    CONSTRAINT fk_note_id FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE
);


-- Cria a tabela de chunks, agora referenciando notas, imagens ou URLs
CREATE TABLE IF NOT EXISTS chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_id UUID NOT NULL, 
    source TEXT NOT NULL CHECK (source IN ('note', 'image', 'url')), 
    image_id UUID, 
    url_id UUID,  
    chunk_index INT NOT NULL,
    embedding VECTOR(1536),
    CONSTRAINT fk_note_id FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE,
    CONSTRAINT fk_image_id FOREIGN KEY (image_id) REFERENCES images (id) ON DELETE CASCADE,
    CONSTRAINT fk_url_id FOREIGN KEY (url_id) REFERENCES urls (id) ON DELETE CASCADE
);

-- Indexação para otimizar buscas vetoriais nos chunks
CREATE INDEX ON chunks USING ivfflat (embedding VECTOR_COSINE_OPS)
WITH (lists = 100);


CREATE OR REPLACE FUNCTION match_chunks(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  offset_param int DEFAULT 0,
  filterCondition text DEFAULT '' 
)
RETURNS TABLE (
  id UUID,
  title VARCHAR(255),
  content TEXT,
  similarity float
)
LANGUAGE plpgsql STABLE
AS $$
BEGIN
  RETURN QUERY EXECUTE format(
    'SELECT id, title, content, similarity
     FROM (
       SELECT DISTINCT ON (n.id)  
         n.id,
         n.title,
         n.content,
         1 - (c.embedding <=> $1) AS similarity
       FROM chunks c
       JOIN notes n ON c.note_id = n.id
       %s
       AND (c.embedding <=> $1) < 1 - $2
       ORDER BY n.id, similarity DESC
     ) AS unique_notes
     ORDER BY similarity DESC
     LIMIT $3 OFFSET $4',
     filterCondition  
  )
  USING query_embedding, match_threshold, match_count, offset_param;
END;
$$;