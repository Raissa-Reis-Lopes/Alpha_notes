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
    metadata JSONB, 
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users (id)
);

-- Cria a tabela de chunks associados às notas
CREATE TABLE IF NOT EXISTS chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_id UUID NOT NULL,
    chunk_index INT NOT NULL,
    text TEXT NOT NULL,
    embedding VECTOR(1536),
    CONSTRAINT fk_note_id FOREIGN KEY (note_id) REFERENCES notes (id)
);

-- Indexação para otimizar buscas vetoriais nos chunks
CREATE INDEX ON chunks USING ivfflat (embedding VECTOR_COSINE_OPS)
WITH (lists = 100);

-- Cria a tabela de imagens associadas às notas
CREATE TABLE IF NOT EXISTS images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_id UUID NOT NULL,
    image_path TEXT NOT NULL,
    CONSTRAINT fk_note_id FOREIGN KEY (note_id) REFERENCES notes (id)
);

CREATE OR REPLACE FUNCTION match_chunks(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id UUID,
  title VARCHAR(255),
  content TEXT,
  chunk_text TEXT,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    id,
    title,
    content,
    chunk_text,
    similarity
  FROM (
    SELECT DISTINCT ON (notes.id)  -- Garante que cada nota seja única
      notes.id,
      notes.title,
      notes.content,
      chunks.text AS chunk_text,
      1 - (chunks.embedding <=> query_embedding) AS similarity
    FROM chunks
    JOIN notes ON chunks.note_id = notes.id
    WHERE chunks.embedding <=> query_embedding < 1 - match_threshold
    ORDER BY notes.id, similarity DESC  -- Primeiro pelo ID da nota para DISTINCT ON, depois pela similaridade
  ) AS unique_notes
  ORDER BY similarity DESC  -- Ordena o resultado final apenas pela similaridade
  LIMIT match_count;
$$;