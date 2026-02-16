-- Create contact_submissions table for storing contact form submissions
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

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

-- Create index on created_at for sorting/filtering
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on row updates
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
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
