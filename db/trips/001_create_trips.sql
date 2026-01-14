CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TYPE trip_status AS ENUM (
    'Active',
    'Emergency',
    'Completed',
    'Cancelled',
    'Snoozed'
);

CREATE TABLE trips (
    trip_id SERIAL PRIMARY KEY,

    start_location GEOGRAPHY(POINT, 4326) NOT NULL,
    destination_location GEOGRAPHY(POINT, 4326) NOT NULL,

    duration_minutes INT NOT NULL,

    actual_arrival_time TIMESTAMP NULL,

    current_status trip_status NOT NULL,
    
    max_extension_minutes INT NOT NULL,

    total_extended_minutes INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);