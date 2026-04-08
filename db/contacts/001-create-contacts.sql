DROP TABLE IF EXISTS emergency_contacts CASCADE;

DROP TYPE IF EXISTS relationship_type;

CREATE TYPE relationship_type AS ENUM ('parent', 'friend', 'partner', 'colleague');

CREATE TABLE emergency_contacts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    emergency_contact_id INT NOT NULL REFERENCES users(user_id),
    relationship relationship_type NOT NULL,
    notes TEXT,
    updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);