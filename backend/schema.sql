CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE "Note" (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_by INTEGER NOT NULL,
    update_by INTEGER NOT NULL,
    CONSTRAINT fk_create_by FOREIGN KEY (create_by) REFERENCES "User" (id),
    CONSTRAINT fk_update_by FOREIGN KEY (update_by) REFERENCES "User" (id)
);

CREATE TABLE "Tag" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE "Note_Tag" (
    id SERIAL PRIMARY KEY,
    note_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    CONSTRAINT fk_note_id FOREIGN KEY (note_id) REFERENCES "Note" (id),
    CONSTRAINT fk_tag_id FOREIGN KEY (tag_id) REFERENCES "Tag" (id)
);

CREATE TABLE "Image" (
    id SERIAL PRIMARY KEY,
    note_id INTEGER NOT NULL,
    image_path TEXT NOT NULL,
    CONSTRAINT fk_note_id FOREIGN KEY (note_id) REFERENCES "Note" (id)
);