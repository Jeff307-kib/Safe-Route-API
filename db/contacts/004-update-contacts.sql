ALTER TABLE emergency_contacts RENAME COLUMN user_id TO requester_id;
ALTER TABLE emergency_contacts RENAME COLUMN emergency_contact_id TO addressee_id;
ALTER TABLE emergency_contacts RENAME COLUMN relationship TO requester_relationship;
ALTER TABLE emergency_contacts RENAME COLUMN notes TO requester_notes;

ALTER TABLE emergency_contacts 
ADD COLUMN addressee_relationship relationship_type,
ADD COLUMN addressee_notes TEXT;

ALTER TYPE relationship_type ADD VALUE 'other';

ALTER TABLE emergency_contacts DROP CONSTRAINT IF EXISTS unique_user_contact_pair;

CREATE UNIQUE INDEX idx_unique_partnership_symmetric 
ON emergency_contacts (GREATEST(requester_id, addressee_id), LEAST(requester_id, addressee_id));