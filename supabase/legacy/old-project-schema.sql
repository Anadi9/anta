-- LEGACY — NOT APPLIED TO THIS PROJECT. Do not run this file.
--
-- These two tables live in the OLD Supabase project, the one behind the
-- previous github.com/Anadi9/anta site. The rebuild uses a fresh Supabase
-- project (ARCHITECTURE.md §7) and never reads or writes either table: its
-- only server-side write is scope_submissions, and its contact section is a
-- mailto: link rather than a form.
--
-- Kept here for exactly two reasons:
--   1. It documents where the historical form submissions still are, if you
--      ever want to export them out of the old project.
--   2. If a real contact form is ever added back, this is the shape the old
--      one had — worth reading before designing a new one, not worth
--      applying as-is.
--
-- Transcribed from github.com/Anadi9/anta/supabase-migration.sql and made
-- idempotent (the original used bare CREATE TRIGGER, which fails on a second
-- run). It was never verified against the live database.

-- ---------------------------------------------------------------------------
-- contact_submissions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  startup_name TEXT,
  phone TEXT,
  idea TEXT NOT NULL,
  description TEXT NOT NULL,
  budget TEXT,
  timeline TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_email
  ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at
  ON contact_submissions(created_at DESC);

-- Shared updated_at trigger function, used by both tables below.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE contact_submissions IS 'Stores contact form submissions from the website';
COMMENT ON COLUMN contact_submissions.id IS 'Unique identifier for each submission';
COMMENT ON COLUMN contact_submissions.name IS 'Full name of the person submitting the form';
COMMENT ON COLUMN contact_submissions.email IS 'Email address of the submitter';
COMMENT ON COLUMN contact_submissions.startup_name IS 'Optional company or project name';
COMMENT ON COLUMN contact_submissions.phone IS 'Optional phone number';
COMMENT ON COLUMN contact_submissions.idea IS 'The main idea or concept being proposed';
COMMENT ON COLUMN contact_submissions.description IS 'Detailed description of the vision or query';
COMMENT ON COLUMN contact_submissions.budget IS 'Budget considerations or range';
COMMENT ON COLUMN contact_submissions.timeline IS 'Timeline expectations';
COMMENT ON COLUMN contact_submissions.created_at IS 'Timestamp when the submission was created';
COMMENT ON COLUMN contact_submissions.updated_at IS 'Timestamp when the submission was last updated';

-- ---------------------------------------------------------------------------
-- project_submissions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS project_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT NOT NULL,
  title TEXT NOT NULL,
  services TEXT[] NOT NULL,
  budget TEXT NOT NULL,
  timeline TEXT NOT NULL,
  description TEXT NOT NULL,
  experience TEXT,
  goals TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_submissions_email
  ON project_submissions(email);
CREATE INDEX IF NOT EXISTS idx_project_submissions_created_at
  ON project_submissions(created_at DESC);

DROP TRIGGER IF EXISTS update_project_submissions_updated_at ON project_submissions;
CREATE TRIGGER update_project_submissions_updated_at
  BEFORE UPDATE ON project_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE project_submissions IS 'Stores project submission forms from the StartProject component';
COMMENT ON COLUMN project_submissions.id IS 'Unique identifier for each submission';
COMMENT ON COLUMN project_submissions.first_name IS 'First name of the person submitting the form';
COMMENT ON COLUMN project_submissions.last_name IS 'Last name of the person submitting the form';
COMMENT ON COLUMN project_submissions.email IS 'Email address of the submitter';
COMMENT ON COLUMN project_submissions.phone IS 'Optional phone number';
COMMENT ON COLUMN project_submissions.company IS 'Company name';
COMMENT ON COLUMN project_submissions.title IS 'Job title or role of the submitter';
COMMENT ON COLUMN project_submissions.services IS 'Array of selected services';
COMMENT ON COLUMN project_submissions.budget IS 'Budget range selection';
COMMENT ON COLUMN project_submissions.timeline IS 'Timeline selection';
COMMENT ON COLUMN project_submissions.description IS 'Detailed project requirements and specifications';
COMMENT ON COLUMN project_submissions.experience IS 'Technical background and constraints';
COMMENT ON COLUMN project_submissions.goals IS 'Array of selected business goals';
COMMENT ON COLUMN project_submissions.created_at IS 'Timestamp when the submission was created';
COMMENT ON COLUMN project_submissions.updated_at IS 'Timestamp when the submission was last updated';
