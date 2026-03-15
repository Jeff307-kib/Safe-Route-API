CREATE TYPE contact_status AS ENUM ('pending', 'accepted', 'declined');

ALTER TABLE emergency_contacts 
ADD COLUMN status contact_status DEFAULT 'pending';


ALTER TABLE emergency_contacts 
ADD CONSTRAINT unique_user_contact_pair UNIQUE (user_id, emergency_contact_id);

ALTER TABLE emergency_contacts 
ADD CONSTRAINT no_self_partnership CHECK (user_id <> emergency_contact_id)
