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
    embedding VECTOR(1536),
    metadata JSONB, 
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users (id)
);


-- A indexação vai ajudar a otimizar as buscas, pois pode chegar em um ponto que existe muitas notas para serem analisadas
CREATE INDEX ON notes USING ivfflat (embedding VECTOR_COSINE_OPS)
WITH (lists = 100);














-- Cria a tabela de imagens associadas às notas
CREATE TABLE IF NOT EXISTS images (
    id SERIAL PRIMARY KEY,
    note_id INTEGER NOT NULL,
    image_path TEXT NOT NULL,
    CONSTRAINT fk_note_id FOREIGN KEY (note_id) REFERENCES notes (id)
);

-- REFACTOR, VAI MANTER ESSA PARTE DAS TAGS?
-- -- Cria a tabela de tags
-- CREATE TABLE IF NOT EXISTS tags (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL
-- );

-- -- Cria a tabela de relacionamento entre notas e tags
-- CREATE TABLE IF NOT EXISTS note_tags (
--     id SERIAL PRIMARY KEY,
--     note_id INTEGER NOT NULL,
--     tag_id INTEGER NOT NULL,
--     CONSTRAINT fk_note_id FOREIGN KEY (note_id) REFERENCES notes (id),
--     CONSTRAINT fk_tag_id FOREIGN KEY (tag_id) REFERENCES tags (id)
-- );

