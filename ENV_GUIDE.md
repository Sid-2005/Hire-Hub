# HireHub Environment Variables & Cloud Deployment Guide

This guide covers every environment variable for the **Backend (Spring Boot)** and **Frontend (Vite + React)**, including what each variable does, whether it is required, and what values to use locally vs. in the cloud.

---

## Quick Overview: Where Do The Files Go?

```text
HireHub/
├── .env                  <--- BACKEND variables for local dev (project root)
├── .env.example          <--- BACKEND template (committed to Git)
│
├── frontend/
│   ├── .env              <--- FRONTEND variables for local dev (inside frontend/)
│   └── .env.example      <--- FRONTEND template (committed to Git)
```

> [!IMPORTANT]
> - **Never commit** actual `.env` files. Both `.gitignore` files explicitly ignore them.
> - **Cloud deployment**: set variables directly in your platform's environment dashboard — do not upload `.env` files.
> - **Required variables have no defaults** in `application.properties`. Spring Boot will throw an error at startup if any required variable is missing.
> - **JWT Secret**: `JWT_SECRET` must be a **Base64-encoded** string representing at least 256 bits (32 bytes). `JwtService` decodes it via `Decoders.BASE64.decode()` — plain text strings will cause runtime failures.

---

## 1. Backend Environment Variables (Spring Boot)

- **Local file:** `.env` in the project root
- **Cloud:** Set in your backend host's environment dashboard (Render, Railway, AWS, Heroku, etc.)
- **Loaded via:** `spring.config.import=optional:file:.env[.properties]` in `application.properties`

### Variable Reference

| Variable | Required? | Purpose | Local Value | Cloud Value |
| :--- | :---: | :--- | :--- | :--- |
| `PORT` | Optional | Port the Spring Boot server listens on. Defaults to `8080`. | `8080` | Injected automatically by most cloud hosts (Render, Railway). |
| `DB_URL` | **Required** | JDBC connection URL for PostgreSQL. | `jdbc:postgresql://localhost:5432/<db_name>` | `jdbc:postgresql://<host>:<port>/<db>?sslmode=require` |
| `DB_USERNAME` | **Required** | Database login username. | Your local PostgreSQL username | Username from your cloud database provider. |
| `DB_PASSWORD` | **Required** | Database password. | Your local PostgreSQL password | Password from your cloud database provider. |
| `JWT_SECRET` | **Required** | Base64-encoded HMAC-SHA256 signing key (min. 256 bits). | Generated Base64 string (see below) | A strong, unique Base64 string per deployment. |
| `JWT_EXPIRATION` | Optional | Token lifetime in milliseconds. Defaults to `86400000` (24 h). | `86400000` | `86400000` or any desired duration. |
| `CORS_ALLOWED_ORIGINS` | **Required** | Comma-separated origin URLs/patterns the browser is allowed to call. | `http://localhost:5173,http://localhost:3000` | Your deployed frontend URL, e.g. `https://hirehub.vercel.app` |
| `JPA_DDL_AUTO` | **Required** | Hibernate schema strategy (`update`, `validate`, `none`, `create-drop`). | `update` | `update` or `validate` if schema is managed separately. |
| `SHOW_SQL` | **Required** | Whether Hibernate logs SQL to stdout (`true` / `false`). | `true` | `false` |

---

### Generating a Valid `JWT_SECRET`

`JwtService` calls `Decoders.BASE64.decode(secretKey)` — the value must be a valid Base64 string of at least 32 bytes.

```bash
# Linux / macOS / Git Bash
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

### PostgreSQL JDBC URL

Cloud providers (Neon, Supabase, Render, Railway, AWS RDS) often give you a standard URI:

```
postgres://username:password@ep-xyz.neon.tech/neondb
```

Spring Boot's JDBC driver requires the `jdbc:` prefix and SSL:

```
jdbc:postgresql://ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
```

---

### Local Backend `.env` Example

```properties
PORT=8080
DB_URL=jdbc:postgresql://localhost:5432/hirehub
DB_USERNAME=postgres
DB_PASSWORD=your_local_password
JWT_SECRET=SeTRdLI4O36do4Ofp2YJOuWtTXU1mD1eiCao86HH9Qk=
JWT_EXPIRATION=86400000
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
JPA_DDL_AUTO=update
SHOW_SQL=true
```

---

## 2. Frontend Environment Variables (Vite + React)

- **Local file:** `frontend/.env`
- **Cloud:** Set in your frontend host's dashboard (Vercel, Netlify, Cloudflare Pages, etc.)
- **Build-time rule:** Variables prefixed with `VITE_` are statically inlined at build time (`npm run build`). `VITE_API_BASE_URL` **must be set before the build runs** — it cannot be changed after deployment.

### Variable Reference

| Variable | Required? | Purpose | Local Value | Cloud Value |
| :--- | :---: | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | **Required** | Base URL for all Axios API calls. Missing this throws an error at both build time and runtime. | `/api` *(Vite proxy forwards to backend)* | `https://<backend-domain>/api` |
| `VITE_BACKEND_TARGET` | Local only | Where the Vite dev-server proxy forwards `/api/*` requests. Not used in production builds. | `http://localhost:8080` | — |
| `PORT` | Optional | Port for the Vite dev server. Defaults to `5173`. | `5173` | — |

> [!WARNING]
> `VITE_API_BASE_URL` in production **must include the `/api` suffix** — all backend controllers are mounted at `/api`. Setting it to just `https://hirehub-backend.onrender.com` (without `/api`) will cause 404 errors on every API call.

> [!NOTE]
> `VITE_BACKEND_TARGET` and `PORT` are dev-server settings only. They have no effect on production builds and do not need to be set in cloud environments.

### Local Frontend `.env` Example

```properties
VITE_API_BASE_URL=/api
VITE_BACKEND_TARGET=http://localhost:8080
PORT=5173
```

---

## 3. Cloud Deployment Guide (Direct, No Containers)

### A. Backend — Render Web Service / Railway / AWS EC2

| Step | Value |
| :--- | :--- |
| **Runtime** | Java 17 or Java 21 |
| **Build command** | `./mvnw clean package -DskipTests` |
| **Start command** | `java -jar target/HireHub_App.jar` |

Set these environment variables in the hosting dashboard:

```
DB_URL            = jdbc:postgresql://<host>:<port>/<db>?sslmode=require
DB_USERNAME       = <cloud_db_username>
DB_PASSWORD       = <cloud_db_password>
JWT_SECRET        = <generated_base64_256bit_key>
CORS_ALLOWED_ORIGINS = https://<your-frontend-domain>
JPA_DDL_AUTO      = update
SHOW_SQL          = false
```

> [!TIP]
> `PORT` does not need to be set manually on Render or Railway — they inject it automatically.

---

### B. Frontend — Vercel / Netlify / Cloudflare Pages / Render Static Site

| Step | Value |
| :--- | :--- |
| **Root directory** | `frontend` |
| **Build command** | `npm install && npm run build` |
| **Output directory** | `dist` |

Set this environment variable **before** triggering the build:

```
VITE_API_BASE_URL = https://<your-backend-domain>/api
```

**SPA routing rewrites** (required so browser-side routes like `/jobs` don't 404 on refresh):

- **Vercel** — [`frontend/vercel.json`](./frontend/vercel.json) is already in the repo:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```
- **Netlify / Render / Cloudflare** — [`frontend/public/_redirects`](./frontend/public/_redirects) is already in the repo:
  ```
  /*    /index.html   200
  ```

---

## 4. Local vs. Cloud Quick-Reference

| Setting | Local Machine | Cloud Production |
| :--- | :--- | :--- |
| Backend config source | Project root `.env` | Cloud dashboard |
| Database | Local PostgreSQL (`localhost:5432`) | Managed PostgreSQL (Neon, Supabase, Render, Railway) |
| `DB_URL` | `jdbc:postgresql://localhost:5432/<db>` | `jdbc:postgresql://<host>/<db>?sslmode=require` |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,...` | `https://<frontend-domain>` |
| `SHOW_SQL` | `true` | `false` |
| `JPA_DDL_AUTO` | `update` | `update` or `validate` |
| Frontend API target | Relative `/api` (Vite proxy) | Absolute `https://<backend-domain>/api` |
| `VITE_API_BASE_URL` | `/api` | `https://<backend-domain>/api` |
