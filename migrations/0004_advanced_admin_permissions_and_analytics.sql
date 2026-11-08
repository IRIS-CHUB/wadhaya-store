ALTER TABLE users ADD COLUMN access_level TEXT NOT NULL DEFAULT 'owner' CHECK (access_level IN ('owner','staff'));
ALTER TABLE users ADD COLUMN permissions TEXT NOT NULL DEFAULT '[]';
ALTER TABLE users ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0,1));
ALTER TABLE users ADD COLUMN created_by TEXT;

DROP INDEX IF EXISTS users_single_admin_idx;
CREATE INDEX IF NOT EXISTS users_access_level_idx ON users(access_level);
CREATE INDEX IF NOT EXISTS users_active_idx ON users(is_active);

CREATE TABLE IF NOT EXISTS admin_activity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_id TEXT,
  actor_email TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS admin_activity_created_idx ON admin_activity(created_at DESC);

CREATE TABLE IF NOT EXISTS site_visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_path TEXT NOT NULL DEFAULT '/',
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS site_visits_created_idx ON site_visits(created_at DESC);
CREATE INDEX IF NOT EXISTS site_visits_path_idx ON site_visits(page_path);
