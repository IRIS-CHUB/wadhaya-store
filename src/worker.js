import defaultProducts from "./data/products.json";
const SESSION_TTL = 60 * 60 * 12;
const PBKDF2_ITERATIONS = 600000;
const COOKIE = "__Host-wadhaya_session";

const json = (data, status = 200, headers = {}) => Response.json(data, {
  status,
  headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...headers },
});

function getCookie(request, name) {
  const value = request.headers.get("Cookie") || "";
  for (const part of value.split(";")) {
    const index = part.indexOf("=");
    if (index < 0) continue;
    if (part.slice(0, index).trim() === name) return part.slice(index + 1).trim();
  }
  return null;
}

function cookieName(url) {
  return url.protocol === "https:" ? COOKIE : "wadhaya_session";
}

function setSessionCookie(url, token, maxAge = SESSION_TTL) {
  const name = cookieName(url);
  const secure = url.protocol === "https:" ? "; Secure" : "";
  return `${name}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

function clearSessionCookie(url) {
  const secure = url.protocol === "https:" ? "; Secure" : "";
  return `${cookieName(url)}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex) {
  return new Uint8Array(hex.match(/.{2}/g).map((part) => parseInt(part, 16)));
}

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return bytesToHex(new Uint8Array(digest));
}

async function passwordHash(password, saltHex, pepper) {
  const material = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(`${password}${pepper}`), "PBKDF2", false, ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: hexToBytes(saltHex), iterations: PBKDF2_ITERATIONS },
    material, 256
  );
  return bytesToHex(new Uint8Array(bits));
}

async function makePasswordRecord(password, pepper) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = bytesToHex(salt);
  const hash = await passwordHash(password, saltHex, pepper);
  return { salt: saltHex, hash, iterations: PBKDF2_ITERATIONS };
}

function constantTimeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function readJson(request, maxBytes = 4096) {
  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.toLowerCase().includes("application/json")) throw new Error("Expected JSON request.");
  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > maxBytes) throw new Error("Request too large");
  return JSON.parse(body);
}

function sameOrigin(request, url) {
  const origin = request.headers.get("Origin");
  return !origin || origin === url.origin;
}

async function createSession(db, userId) {
  const tokenBytes = crypto.getRandomValues(new Uint8Array(32));
  const token = bytesToHex(tokenBytes);
  const tokenHash = await sha256(token);
  const now = Math.floor(Date.now() / 1000);
  await db.prepare("INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)")
    .bind(tokenHash, userId, now + SESSION_TTL, now).run();
  await db.prepare("DELETE FROM sessions WHERE expires_at <= ?").bind(now).run();
  return token;
}

async function getAdmin(request, env, url) {
  const token = getCookie(request, cookieName(url));
  if (!token) return null;
  const tokenHash = await sha256(token);
  const now = Math.floor(Date.now() / 1000);
  const row = await env.DB.prepare(
    "SELECT users.id, users.email FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.token_hash = ? AND sessions.expires_at > ? AND users.role = 'admin' LIMIT 1"
  ).bind(tokenHash, now).first();
  return row || null;
}

async function handleAuth(request, env, url) {
  const path = url.pathname;
  if (request.method === "GET" && path === "/api/auth/me") {
    const admin = await getAdmin(request, env, url);
    return admin ? json({ authenticated: true, admin: { email: admin.email } }) : json({ authenticated: false }, 401);
  }

  if (request.method === "POST" && !sameOrigin(request, url)) return json({ error: "Invalid request origin." }, 403);

  if (request.method === "POST" && path === "/api/auth/setup") {
    if (!env.ADMIN_SETUP_TOKEN || !env.PASSWORD_PEPPER) return json({ error: "Admin setup is not configured. Add the required Worker secrets first." }, 503);
    const count = await env.DB.prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'").first();
    if (Number(count?.count || 0) > 0) return json({ error: "Admin is already configured." }, 409);
    const body = await readJson(request);
    if (!constantTimeEqual(body.setupToken, env.ADMIN_SETUP_TOKEN)) return json({ error: "Invalid setup token." }, 403);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Enter a valid email address." }, 400);
    if (password.length < 12 || password.length > 128) return json({ error: "Password must be between 12 and 128 characters." }, 400);
    const record = await makePasswordRecord(password, env.PASSWORD_PEPPER);
    const id = crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);
    try {
      await env.DB.prepare("INSERT INTO users (id, email, password_hash, password_salt, password_iterations, role, created_at) VALUES (?, ?, ?, ?, ?, 'admin', ?)")
        .bind(id, email, record.hash, record.salt, record.iterations, now).run();
    } catch {
      return json({ error: "Admin setup has already been completed." }, 409);
    }
    const token = await createSession(env.DB, id);
    return json({ ok: true }, 201, { "Set-Cookie": setSessionCookie(url, token) });
  }

  if (request.method === "POST" && path === "/api/auth/login") {
    if (!env.PASSWORD_PEPPER) return json({ error: "Authentication is not configured." }, 503);
    const body = await readJson(request);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (email.length > 254 || password.length > 128) return json({ error: "Invalid email or password." }, 400);

    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const rateKey = await sha256(`${ip}:${email}`);
    const now = Math.floor(Date.now() / 1000);
    const attempts = await env.DB.prepare("SELECT attempts, window_started FROM login_attempts WHERE rate_key = ?").bind(rateKey).first();
    if (attempts && Number(attempts.window_started) > now - 900 && Number(attempts.attempts) >= 5) {
      return json({ error: "Too many attempts. Try again in 15 minutes." }, 429, { "Retry-After": "900" });
    }

    const user = await env.DB.prepare("SELECT id, email, password_hash, password_salt, password_iterations FROM users WHERE email = ? AND role = 'admin' LIMIT 1").bind(email).first();
    let valid = false;
    if (user) {
      const candidate = await passwordHash(password, user.password_salt, env.PASSWORD_PEPPER);
      valid = constantTimeEqual(candidate, user.password_hash);
    }

    if (!valid) {
      if (attempts && Number(attempts.window_started) > now - 900) {
        await env.DB.prepare("UPDATE login_attempts SET attempts = attempts + 1 WHERE rate_key = ?").bind(rateKey).run();
      } else {
        await env.DB.prepare("INSERT INTO login_attempts (rate_key, attempts, window_started) VALUES (?, 1, ?) ON CONFLICT(rate_key) DO UPDATE SET attempts = 1, window_started = excluded.window_started").bind(rateKey, now).run();
      }
      return json({ error: "Email or password is incorrect." }, 401);
    }

    await env.DB.prepare("DELETE FROM login_attempts WHERE rate_key = ?").bind(rateKey).run();
    const token = await createSession(env.DB, user.id);
    return json({ ok: true }, 200, { "Set-Cookie": setSessionCookie(url, token) });
  }

  if (request.method === "POST" && path === "/api/auth/logout") {
    const token = getCookie(request, cookieName(url));
    if (token) await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256(token)).run();
    return json({ ok: true }, 200, { "Set-Cookie": clearSessionCookie(url) });
  }

  return null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/auth/")) {
      try {
        const response = await handleAuth(request, env, url);
        return response || json({ error: "Not found." }, 404);
      } catch (error) {
        return json({ error: error.message === "Request too large" ? error.message : "Authentication service error." }, error.message === "Request too large" ? 413 : 500);
      }
    }

    if (url.pathname === "/api/products" && request.method === "GET") {
      try {
        let rows = await env.DB.prepare("SELECT product_json FROM products ORDER BY sort_order, id").all();
        if (!rows.results.length) {
          await env.DB.batch(defaultProducts.map((product, index) =>
            env.DB.prepare("INSERT OR IGNORE INTO products (id, product_json, sort_order, updated_at) VALUES (?, ?, ?, ?)")
              .bind(product.id, JSON.stringify(product), index, Math.floor(Date.now() / 1000))
          ));
          rows = await env.DB.prepare("SELECT product_json FROM products ORDER BY sort_order, id").all();
        }
        return json({ products: rows.results.map((row) => JSON.parse(row.product_json)) });
      } catch {
        return json({ products: defaultProducts, source: "bundled-fallback" });
      }
    }
    if (url.pathname === "/api/reviews" && request.method === "POST") {
      try {
        if (!sameOrigin(request, url)) return json({ error: "Invalid request origin." }, 403);
        const body = await readJson(request, 5000);
        const productId = String(body.productId || "");
        const customerName = String(body.customerName || "").trim();
        const comment = String(body.comment || "").trim();
        const rating = Number(body.rating);
        if (!/^[a-z0-9-]{2,50}$/i.test(productId) || !Number.isInteger(rating) || rating < 1 || rating > 5 || !comment || comment.length > 2000 || customerName.length > 80) return json({ error: "يرجى إدخال تقييم وتعليق صحيحين." }, 400);
        const product = await env.DB.prepare("SELECT id FROM products WHERE id = ?").bind(productId).first();
        if (!product) return json({ error: "المنتج غير موجود." }, 404);
        const now = Math.floor(Date.now() / 1000);
        await env.DB.prepare("INSERT INTO product_reviews (product_id, customer_name, rating, comment, created_at) VALUES (?, ?, ?, ?, ?)").bind(productId, customerName || "زبون", rating, comment, now).run();
        return json({ ok: true }, 201);
      } catch (error) {
        return json({ error: error.message === "Request too large" ? error.message : "تعذر حفظ رأيك حالياً." }, error.message === "Request too large" ? 413 : 500);
      }
    }
    if (url.pathname.startsWith("/api/admin/")) {
      const admin = await getAdmin(request, env, url);
      if (!admin) return json({ error: "Unauthorized." }, 401);
      if (request.method === "GET" && url.pathname === "/api/admin/reviews") {
        const rows = await env.DB.prepare("SELECT r.id, r.product_id, COALESCE(json_extract(p.product_json, '$.name.ar'), r.product_id) AS product_name, r.customer_name, r.rating, r.comment, r.created_at FROM product_reviews r LEFT JOIN products p ON p.id = r.product_id ORDER BY r.created_at DESC LIMIT 500").all();
        return json({ reviews: rows.results });
      }
      if (request.method === "GET" && url.pathname === "/api/admin/products") {
        let rows = await env.DB.prepare("SELECT product_json FROM products ORDER BY sort_order, id").all();
        if (!rows.results.length) {
          await env.DB.batch(defaultProducts.map((product, index) => env.DB.prepare("INSERT OR IGNORE INTO products (id, product_json, sort_order, updated_at) VALUES (?, ?, ?, ?)").bind(product.id, JSON.stringify(product), index, Math.floor(Date.now() / 1000))));
          rows = await env.DB.prepare("SELECT product_json FROM products ORDER BY sort_order, id").all();
        }
        return json({ products: rows.results.map((row) => JSON.parse(row.product_json)) });
      }
      if (request.method === "PUT" && url.pathname === "/api/admin/products") {
        if (!sameOrigin(request, url)) return json({ error: "Invalid request origin." }, 403);
        const body = await readJson(request, 200000);
        if (!Array.isArray(body.products) || body.products.length > 100) return json({ error: "قائمة المنتجات غير صالحة." }, 400);
        const ids = new Set();
        for (const p of body.products) {
          if (!p || typeof p.id !== "string" || !/^[a-z0-9-]{2,50}$/i.test(p.id) || ids.has(p.id) || !p.name?.ar || !p.name?.en || !p.type?.ar || !p.type?.en || !Number.isFinite(Number(p.price)) || Number(p.price) < 0 || Number(p.price) > 100000 || typeof p.image !== "string" || p.image.length > 1000) return json({ error: "تأكد من الاسم والسعر والصورة ومعرّف كل منتج." }, 400);
          ids.add(p.id);
        }
        const now = Math.floor(Date.now() / 1000);
        const statements = [env.DB.prepare("DELETE FROM products")];
        body.products.forEach((p, index) => statements.push(env.DB.prepare("INSERT INTO products (id, product_json, sort_order, updated_at) VALUES (?, ?, ?, ?)").bind(p.id, JSON.stringify(p), index, now)));
        await env.DB.batch(statements);
        return json({ ok: true, products: body.products });
      }
      if (request.method === "GET" && url.pathname === "/api/admin/me") {
        return json({ authenticated: true, admin: { email: admin.email } });
      }
      return json({ error: "Not found." }, 404);
    }

    return env.ASSETS.fetch(request);
  },
};
