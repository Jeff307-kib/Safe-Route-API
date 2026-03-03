CREATE TABLE profile_details (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE, 
    date_of_birth DATE,
    blood_type VARCHAR(5) CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    medical_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
      REFERENCES users(user_id)
      ON DELETE CASCADE -- If user is deleted, their medical info is deleted too
);