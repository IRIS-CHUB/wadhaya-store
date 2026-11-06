import { readFile, access } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const productsPath = path.join(root, 'src/data/products.json');
const products = JSON.parse(await readFile(productsPath, 'utf8'));

if (!Array.isArray(products) || products.length === 0) {
  throw new Error('Product catalogue must be a non-empty JSON array.');
}

const ids = new Set();
for (const [index, product] of products.entries()) {
  const label = `products[${index}]`;
  if (!product || typeof product !== 'object') throw new Error(`${label} must be an object.`);
  if (typeof product.id !== 'string' || !/^[a-z0-9-]{2,50}$/i.test(product.id)) {
    throw new Error(`${label}.id is invalid.`);
  }
  if (ids.has(product.id)) throw new Error(`Duplicate product id: ${product.id}`);
  ids.add(product.id);

  for (const field of ['name', 'type', 'note', 'tag', 'description']) {
    if (!product[field] || typeof product[field].ar !== 'string' || !product[field].ar.trim()
      || typeof product[field].en !== 'string' || !product[field].en.trim()) {
      throw new Error(`${label}.${field} must contain Arabic and English text.`);
    }
  }

  if (!Number.isFinite(product.price) || product.price < 0) {
    throw new Error(`${label}.price must be a non-negative number.`);
  }
  if (product.oldPrice != null && (!Number.isFinite(product.oldPrice) || product.oldPrice < product.price)) {
    throw new Error(`${label}.oldPrice must be a number greater than or equal to price.`);
  }
  if (typeof product.image !== 'string' || !product.image.startsWith('/')
    || product.image.includes('..') || product.image.includes('://')) {
    throw new Error(`${label}.image must be a safe local public path.`);
  }

  const imagePath = path.join(root, 'public', product.image.slice(1));
  try {
    await access(imagePath);
  } catch {
    throw new Error(`${label}.image does not exist: public${product.image}`);
  }

  for (const group of ['top', 'middle', 'base']) {
    if (product.notes && !Array.isArray(product.notes[group])) {
      throw new Error(`${label}.notes.${group} must be an array.`);
    }
  }
}

const css = await readFile(path.join(root, 'src/styles.css'), 'utf8');
const localUrls = [...css.matchAll(/url\(([^)]+)\)/g)].map(([, value]) => value.trim().replace(/^['"]|['"]$/g, '')).filter(value => value.startsWith('/'));
for (const url of localUrls) {
  const assetPath = path.join(root, 'public', url.slice(1));
  try {
    await access(assetPath);
  } catch {
    throw new Error(`CSS references a missing public asset: ${url}`);
  }
}

console.log(`Validated ${products.length} products and ${localUrls.length} local CSS asset references.`);
