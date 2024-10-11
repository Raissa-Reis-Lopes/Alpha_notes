-- Ativar a extensão pgcrypto se ainda não estiver ativada
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Criar a tabela users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
    username VARCHAR(50) NOT NULL UNIQUE,          
    email VARCHAR(100) NOT NULL UNIQUE,            
    firstName VARCHAR(100) NOT NULL,               
    lastName VARCHAR(100) NOT NULL,                
    password VARCHAR(255) NOT NULL,                
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);
