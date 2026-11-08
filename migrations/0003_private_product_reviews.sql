CREATE TABLE IF NOT EXISTS product_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id TEXT NOT NULL,
  customer_name TEXT NOT NULL DEFAULT 'زبون',
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL CHECK (length(comment) BETWEEN 1 AND 2000),
  created_at INTEGER NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS product_reviews_created_at_idx ON product_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS product_reviews_product_id_idx ON product_reviews(product_id);
