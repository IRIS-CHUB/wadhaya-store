# Wadhaya Store — React + Vite + Cloudflare Workers

Luxury bilingual (Arabic/English) perfume storefront with WhatsApp checkout and a private administrator sign-in.

## Existing storefront
- Arabic RTL / English LTR storefront
- Product catalogue, product detail pages and shopping bag
- WhatsApp order handoff
- Existing images and styling retained

## Administrator authentication
- Open `/admin.html`.
- Only an administrator account is accepted; there is no customer registration.
- Passwords are hashed with PBKDF2-HMAC-SHA-256 and a server-only pepper.
- Sessions use random opaque tokens; only SHA-256 token hashes are stored in D1.
- Session cookies are HttpOnly, SameSite=Strict and Secure on HTTPS.
- Login attempts are rate-limited per IP/email key.
- The one-time setup endpoint is disabled after the first administrator exists.

## Local development
```bash
npm install
npm run dev
```

Vite serves the storefront, but authentication endpoints require a local Worker runtime and D1 binding. Use Wrangler for an end-to-end local auth test.

## Cloudflare setup (first deployment)
1. Install dependencies: `npm install`.
2. Create the D1 database in the repository root:
   ```bash
   npx wrangler@4.153.0 d1 create wadhaya-store-db
   ```
   Copy the returned `database_id` into the `d1_databases[0].database_id` field in `wrangler.jsonc`, then commit that non-secret ID.
3. Set the Worker secrets. Generate long random values; do not commit them:
   ```bash
   npx wrangler secret put PASSWORD_PEPPER
   npx wrangler secret put ADMIN_SETUP_TOKEN
   ```
   Use different values, each at least 32 random bytes. Keep the setup token available only for the one-time account creation.
4. Deploy the Worker and static assets once. Wrangler can provision the D1 database from the binding in `wrangler.jsonc`:
   ```bash
   npm run deploy
   ```
5. Apply the migration to the newly provisioned database:
   ```bash
   npx wrangler d1 migrations apply wadhaya-store-db --remote
   ```
6. Visit `https://YOUR-DOMAIN/admin.html`, choose **إعداد أول حساب مدير**, and provide your email, a password of at least 12 characters, and the setup token.
7. After successful setup, remove the setup secret:
   ```bash
   npx wrangler secret delete ADMIN_SETUP_TOKEN
   ```
8. Test login, logout, and `GET /api/admin/me`. Keep the admin URL and account details private.

Wrangler may create the D1 database automatically from the binding on deployment. If it does, confirm the database is visible in Cloudflare and that the migration has been applied before using admin authentication.

## Private customer product feedback
- Customers can submit a star rating and private comment from each product detail page.
- Feedback is stored in the private Cloudflare D1 database, not in public GitHub files.
- Only the authenticated administrator can read feedback at `/admin-reviews.html`.
- Apply the new migration before deploying this feature:
  ```bash
  npx wrangler d1 migrations apply wadhaya-store-db --remote
  ```
- Then deploy the Worker and storefront:
  ```bash
  npm run deploy
  ```

## Important deployment note
This branch changes deployment from a static Pages-only build to a Worker with static assets and D1. Do not replace the current production deployment until the D1 database, secrets, custom domain routing and smoke tests are complete. Preserve the existing production project as rollback until then.

## Security notes
- Never put passwords, setup tokens, or the password pepper in Vite environment variables or browser code.
- The setup token is one-time and the endpoint refuses setup after an admin account exists.
- Keep Cloudflare account access protected with MFA.
- Online payments, product CRUD APIs and order persistence are not included in this authentication foundation yet.
