CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    recipient_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    reference_id INT, 
    reference_type VARCHAR(50), 
    notification_message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT NOW(),
    read_at TIMESTAMP 
);

