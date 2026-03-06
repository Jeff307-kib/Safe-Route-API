CREATE TABLE emergency_contacts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    relationship VARCHAR(50), 
    created_at TIMESTAMP DEFAULT NOW()
);
