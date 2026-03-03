ALTER TABLE trips 
ADD COLUMN user_id INT NOT NULL,
ADD CONSTRAINT fk_user_trip
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id)
    ON DELETE CASCADE;