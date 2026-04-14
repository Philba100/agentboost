-- Create share_links table for managing shareable links to skills
-- This allows users to generate clean, trackable share links

CREATE TABLE IF NOT EXISTS share_links (
  -- Unique share identifier (8-4-4-4-12 alphanumeric format)
  share_id VARCHAR(36) PRIMARY KEY,
  
  -- Reference to the skill being shared
  skill_id VARCHAR(255) NOT NULL,
  
  -- User who created the share link (for tracking)
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- When the share link was created
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Optional expiration date
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Track how many times this link has been viewed
  view_count INTEGER DEFAULT 0,
  
  -- Timestamps for record management
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX idx_share_links_share_id ON share_links(share_id);
CREATE INDEX idx_share_links_user_id ON share_links(user_id);
CREATE INDEX idx_share_links_skill_id ON share_links(skill_id);
CREATE INDEX idx_share_links_created_at ON share_links(created_at DESC);

-- Set up Row Level Security (RLS)
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view a share link (public links)
CREATE POLICY share_links_select_public ON share_links
  FOR SELECT
  USING (true);

-- Policy: Users can only create share links for themselves
CREATE POLICY share_links_insert_own ON share_links
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update and delete their own share links
CREATE POLICY share_links_update_own ON share_links
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY share_links_delete_own ON share_links
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_share_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER share_links_updated_at_trigger
  BEFORE UPDATE ON share_links
  FOR EACH ROW
  EXECUTE FUNCTION update_share_links_updated_at();
