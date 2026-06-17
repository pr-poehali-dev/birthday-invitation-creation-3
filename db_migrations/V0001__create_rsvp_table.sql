CREATE TABLE rsvp (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('attending', 'not_attending')),
  guests_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);