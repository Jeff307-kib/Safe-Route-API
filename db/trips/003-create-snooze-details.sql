CREATE TABLE snooze_details (
    snooze_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    trip_id INT NOT NULL,
    snooze_duration_minutes INT NOT NULL,
    reason VARCHAR(255),
    start_time TIMESTAMP DEFAULT NOW(),
    time_limit INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_snooze_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_snooze_trip
        FOREIGN KEY (trip_id)
        REFERENCES trips(trip_id)
        ON DELETE CASCADE
);
