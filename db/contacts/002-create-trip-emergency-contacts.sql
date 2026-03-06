CREATE TABLE trip_emergency_contacts (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL REFERENCES trips(trip_id) ON DELETE CASCADE,
    contact_id INTEGER NOT NULL REFERENCES emergency_contacts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(trip_id, contact_id) -- Prevents adding the same contact twice to one trip
);