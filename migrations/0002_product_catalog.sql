CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  product_json TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS products_sort_order_idx ON products(sort_order);
