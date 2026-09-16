-- AgentBoost Hybrid Multi-Agent Architecture
-- Adds a semantic skill registry backed by pgvector for dynamic skill routing

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS skill_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT NOT NULL,
  markdown_path TEXT,
  content TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_skill_embeddings_skill_id
  ON skill_embeddings (skill_id);

CREATE INDEX IF NOT EXISTS idx_skill_embeddings_slug
  ON skill_embeddings (slug);

CREATE INDEX IF NOT EXISTS idx_skill_embeddings_category
  ON skill_embeddings (category);

-- Vector similarity index for semantic routing.
-- hnsw is preferred for production workloads; ivfflat is usable for smaller datasets.
CREATE INDEX IF NOT EXISTS idx_skill_embeddings_hnsw
  ON skill_embeddings USING hnsw (embedding vector_cosine_ops);

-- Semantic search function for matching user intent to skills.
CREATE OR REPLACE FUNCTION match_skills (
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
) RETURNS TABLE (
  skill_id TEXT,
  name TEXT,
  description TEXT,
  content TEXT,
  similarity FLOAT
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    se.skill_id,
    se.name,
    se.description,
    se.content,
    1 - (se.embedding <=> query_embedding) AS similarity
  FROM skill_embeddings se
  WHERE 1 - (se.embedding <=> query_embedding) > match_threshold
  ORDER BY se.embedding <=> query_embedding ASC
  LIMIT match_count;
END;
$$;

CREATE OR REPLACE FUNCTION update_skill_embeddings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS skill_embeddings_updated_at_trigger ON skill_embeddings;

CREATE TRIGGER skill_embeddings_updated_at_trigger
BEFORE UPDATE ON skill_embeddings
FOR EACH ROW
EXECUTE FUNCTION update_skill_embeddings_updated_at();

CREATE OR REPLACE FUNCTION search_skill_embeddings(
  query_embedding vector(1536),
  match_count INTEGER DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  skill_id TEXT,
  slug TEXT,
  name TEXT,
  category TEXT,
  description TEXT,
  markdown_path TEXT,
  content TEXT,
  similarity DOUBLE PRECISION
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    se.id,
    se.skill_id,
    se.slug,
    se.name,
    se.category,
    se.description,
    se.markdown_path,
    se.content,
    1 - (se.embedding <=> query_embedding) AS similarity
  FROM skill_embeddings se
  WHERE se.embedding IS NOT NULL
  ORDER BY se.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

ALTER TABLE skill_embeddings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS skill_embeddings_select_public ON skill_embeddings;
CREATE POLICY skill_embeddings_select_public
  ON skill_embeddings
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS skill_embeddings_modify_admin ON skill_embeddings;
CREATE POLICY skill_embeddings_modify_admin
  ON skill_embeddings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY skill_embeddings_update_admin
  ON skill_embeddings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY skill_embeddings_delete_admin
  ON skill_embeddings
  FOR DELETE
  USING (true);

-- Optional helper view for easier dashboard reads.
CREATE OR REPLACE VIEW skill_registry AS
SELECT
  skill_id,
  slug,
  name,
  category,
  description,
  markdown_path,
  content,
  created_at,
  updated_at
FROM skill_embeddings;
