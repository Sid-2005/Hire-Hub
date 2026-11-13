# HireHub 💼🚀

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Website-brightgreen?style=for-the-badge&logo=vercel)](https://hire-hub-frontend-psi.vercel.app)
[![Demo Video](https://img.shields.io/badge/Demo-Watch%20Video-red?style=for-the-badge&logo=github&logoColor=white)](#-demo-video)
[![Java](https://img.shields.io/badge/Java-21%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.1-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%2B-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

> **HireHub** is a modern, decoupled full-stack tech job board and applicant management platform. It pairs a high-performance **Spring Boot 4** RESTful backend with an interactive **React 19 + Vite** Single-Page Application (SPA), delivering seamless job discovery, real-time search, multi-criteria filtering, role-based job management, and one-click application tracking.

---

## 🌐 Live Demo

Experience the live application here:  
👉 **[https://hire-hub-frontend-psi.vercel.app](https://hire-hub-frontend-psi.vercel.app)**

- **Frontend:** Hosted on **Vercel** with automatic SPA rewrites
- **Backend:** Hosted on **Render** (REST API)
- **Database:** Managed Cloud **PostgreSQL**

---

## 🎥 Demo Video

Watch a complete walkthrough of HireHub: registration and login, job search and filtering, one-click apply, and the recruiter dashboard.

https://github.com/user-attachments/assets/6f039eae-6830-4ad2-b24b-0e7673040458

---

## ✨ Features

### 👤 Authentication & Role-Based Access Control (RBAC)
- **Stateless JWT Security:** Secure authentication via signed HMAC-SHA256 JSON Web Tokens with automatic Bearer token injection on API requests.
- **Granular Roles:** Distinct permissions for standard job seekers (`USER`) and recruiters/administrators (`ADMIN`).
- **Real-Time Client-Side Protection:** Client route guards (`ProtectedRoute`), global Axios 401 interceptors, and automatic token expiration tracking.
- **User-Friendly Auth UI:** Modern login and registration interfaces featuring interactive password strength meters and visibility toggles.

### 🔍 Job Discovery & Advanced Search
- **Full-Text Keyword Search:** Case-insensitive search across job titles, descriptions, and required tech stacks.
- **Multi-Parametric Filtering:** Filter listings simultaneously by technology stack skills and years of experience.
- **Detailed Job Postings:** Comprehensive views displaying company requirements, tech stack badges, applicant counters, and live application statuses.

### 📝 Application Lifecycle Management
- **One-Click Apply:** Authenticated users can instantly apply to vacancies.
- **Duplicate Prevention:** Database-enforced unique constraints ensure users cannot apply twice to the same posting.
- **Applicant Dashboard (`USER`):** Dedicated "My Applications" view tracking all submitted applications.
- **Recruiter Dashboard (`ADMIN`):** Dedicated administrative console to review, track, and manage applicant pools per listing or across the entire platform.

### 🛠️ Administrative Job Management
- **CRUD Operations:** Recruiter-exclusive interfaces to create, preview, edit, and delete job openings.
- **Dynamic Tagging:** Flexible tag inputs for specifying dynamic technology stacks and experience requirements.

---

## 🛠️ Tech Stack

### Frontend
- **Framework & Runtime:** [React 19.3.1](https://react.dev/)
- **Build Tool:** [Vite 8.3.5](https://vitejs.dev/)
- **Routing:** [React Router v7 (v7.18.4)](https://reactrouter.com/)
- **HTTP Client:** [Axios v1.21.0](https://axios-http.com/) (configured with request/response interceptors)
- **Token Decoding:** [jwt-decode v4.0.0](https://github.com/auth0/jwt-decode)
- **Icons & Styling:** [Lucide React v1.62.0](https://lucide.dev/), Modular Vanilla CSS3 with responsive layouts & CSS variables
- **Linter:** [Oxlint v1.89.0](https://oxc.rs/)

### Backend
- **Framework:** [Spring Boot 4.1.1](https://spring.io/projects/spring-boot)
- **Language:** Java 21 / 17
- **Security:** [Spring Security 6](https://spring.io/projects/spring-security) (Stateless JWT Authentication, BCrypt password hashing, CORS configuration)
- **JWT Provider:** [Java JWT (JJWT v0.11.5)](https://github.com/jwtk/jjwt)
- **ORM / Persistence:** [Spring Data JPA](https://spring.io/projects/spring-data-jpa) with [Hibernate](https://hibernate.org/)
- **Boilerplate Reduction:** [Project Lombok](https://projectlombok.org/)
- **Build Tool:** Apache Maven with Maven Wrapper (`./mvnw`)

### Database
- **Engine:** [PostgreSQL](https://www.postgresql.org/)
- **Driver:** PostgreSQL JDBC Driver (`org.postgresql:postgresql`)

### Cloud & Deployment
- **Frontend Hosting:** [Vercel](https://vercel.com/) (Static Single-Page Application)
- **Backend Hosting:** [Render](https://render.com/) (Web Service containerized JAR execution)
- **Cloud Database:** Neon / Supabase / Render Managed PostgreSQL

---

## 📂 Project Architecture

```text
HireHub/
├── .env.example                          # Backend environment variables template
├── ENV_GUIDE.md                          # Detailed environment setup & deployment manual
├── HELP.md                               # Spring Boot references and guides
├── pom.xml                               # Maven project definition and dependencies
├── mvnw / mvnw.cmd                       # Maven wrapper executables
│
├── src/                                  # Spring Boot Backend Source Code
│   ├── main/
│   │   ├── java/com/example/HireHub/
│   │   │   ├── HireHubApplication.java   # Spring Boot main entry point
│   │   │   ├── configuration/            # Security & Filter Configurations
│   │   │   │   ├── JwtFilter.java        # OncePerRequestFilter for Bearer tokens
│   │   │   │   └── SecurityConfiguration.java # SecurityFilterChain, CORS, and PasswordEncoder
│   │   │   ├── controller/               # REST API Controllers
│   │   │   │   ├── HireHubController.java     # Job CRUD, search & filter endpoints
│   │   │   │   ├── JobApplicationController.java # Application submission & review endpoints
│   │   │   │   └── MyUserController.java      # Auth endpoints (/login, /register)
│   │   │   ├── model/                    # JPA Entities
│   │   │   │   ├── JobApplication.java   # Application records with unique constraints
│   │   │   │   ├── JobPost.java          # Job post entity with element collections
│   │   │   │   ├── MyUser.java           # User credentials and roles
│   │   │   │   └── MyUsersDetail.java    # Spring Security UserDetails adapter
│   │   │   ├── repo/                     # Spring Data JPA Repositories
│   │   │   │   ├── JobApplicationRepo.java
│   │   │   │   ├── JobPostRepo.java
│   │   │   │   └── MyUserRepo.java
│   │   │   └── service/                  # Business Logic Services
│   │   │       ├── JobApplicationService.java
│   │   │       ├── JobPostService.java
│   │   │       ├── JwtService.java       # HMAC-SHA256 signing and claims extraction
│   │   │       ├── MyUserDetailService.java
│   │   │       └── MyUsersService.java
│   │   └── resources/
│   │       └── application.properties    # Environment-backed configuration mappings
│   └── test/                             # Automated Tests
│
└── frontend/                             # React 19 + Vite Frontend SPA
    ├── .env.example                      # Frontend environment template
    ├── index.html                        # HTML entry point with favicon
    ├── package.json                      # NPM dependencies and scripts
    ├── vite.config.js                    # Vite configuration with local proxy & build guards
    ├── vercel.json                       # Vercel SPA routing rewrite configuration
    ├── public/
    │   ├── _redirects                    # Netlify/Render static site SPA routing rule
    │   └── favicon.svg                   # Brand icon
    └── src/
        ├── main.jsx                      # React DOM mounting entry point
        ├── App.jsx                       # Client-side router configuration
        ├── api/
        │   └── hirehub.js                # Centralized Axios instance with auth interceptors
        ├── context/
        │   └── AuthContext.jsx           # Global authentication context & token state
        ├── components/                   # Reusable UI Components
        │   ├── Navbar.jsx                # Responsive navigation bar
        │   └── ProtectedRoute.jsx        # Role-based route guard
        └── pages/                        # Views & Route Components
            ├── HomePage.jsx              # Landing page
            ├── LoginPage.jsx             # User & Admin Login
            ├── RegisterPage.jsx          # Account registration
            ├── JobsPage.jsx              # Jobs catalog with search and filters
            ├── JobDetailPage.jsx         # Detailed job specifications & application trigger
            ├── JobFormPage.jsx           # Admin job creation & edit form
            ├── ApplicantsPage.jsx        # Admin application management console
            └── MyApplicationsPage.jsx    # Candidate application tracker
```

---

## 🚀 Getting Started / Local Setup

Follow these steps to run HireHub on your local development machine.

### Prerequisites
- **Java Development Kit (JDK):** Version 17 or 21+ ([Download JDK](https://adoptium.net/))
- **Node.js & npm:** Node.js v18+ and npm v9+ ([Download Node.js](https://nodejs.org/))
- **PostgreSQL Database:** Running locally on port `5432` or via a cloud instance ([Download PostgreSQL](https://www.postgresql.org/download/))
- **Git:** Installed and configured ([Download Git](https://git-scm.com/))

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/<your-username>/HireHub.git
cd HireHub
```

---

### Step 2: Configure Backend Environment Variables
Create a `.env` file in the **root** of the project:
```bash
cp .env.example .env
```
Open `.env` and fill in your local PostgreSQL credentials and a secure Base64 JWT secret:
```properties
PORT=8080
DB_URL=jdbc:postgresql://localhost:5432/hirehub
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION=86400000
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
JPA_DDL_AUTO=update
SHOW_SQL=true
```

> **Generating a 256-bit Base64 JWT secret:**
> ```bash
> # Linux / macOS / Git Bash
> openssl rand -base64 32
>
> # Windows PowerShell
> [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
> ```

---

### Step 3: Run the Backend
Using the included Maven Wrapper, compile and boot the Spring Boot application:
```bash
# On Linux / macOS:
./mvnw clean spring-boot:run

# On Windows:
.\mvnw.cmd clean spring-boot:run
```
The backend server will start on **`http://localhost:8080`**.

---

### Step 4: Configure Frontend Environment Variables
Navigate to the `frontend/` directory and create the local environment file:
```bash
cd frontend
cp .env.example .env
```
Ensure your `frontend/.env` contains:
```properties
VITE_API_BASE_URL=/api
VITE_BACKEND_TARGET=http://localhost:8080
PORT=5173
```
*(In local development, the Vite dev server uses `VITE_BACKEND_TARGET` to proxy `/api/*` calls directly to your local Spring Boot instance without CORS complications).*

---

### Step 5: Install Dependencies & Run the Frontend
Inside the `frontend/` directory:
```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
The client application will launch at **`http://localhost:5173`**. Open this URL in your browser to begin exploring HireHub!

---

## 📡 API Endpoints

All backend endpoints are prefixed with `/api`. Protected routes require an `Authorization: Bearer <token>` header.

### 🔐 Authentication
| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/register` | Public | Register a new user (`role`: `"USER"` or `"ADMIN"`). |
| `POST` | `/api/login` | Public | Authenticate user credentials and receive a signed JWT token. |

### 💼 Job Openings
| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | `USER`, `ADMIN` | Fetch all active job listings. |
| `GET` | `/api/jobs/{id}` | `USER`, `ADMIN` | Fetch a specific job posting by its ID. |
| `GET` | `/api/jobs/search?keyword={text}` | `USER`, `ADMIN` | Search jobs matching a keyword across title, description, or stack. |
| `GET` | `/api/jobs/filter?skill={s}&years={y}` | `USER`, `ADMIN` | Filter jobs by skill name and/or minimum years of experience. |
| `POST` | `/api/jobs` | `ADMIN` only | Create a new job vacancy posting. |
| `PUT` | `/api/jobs/{id}` | `ADMIN` only | Update an existing job vacancy posting. |
| `DELETE`| `/api/jobs/{id}` | `ADMIN` only | Delete a job vacancy posting. |

### 📄 Job Applications
| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/jobs/{id}/apply` | `USER`, `ADMIN` | Submit an application for the specified job posting. |
| `GET` | `/api/jobs/{id}/applied` | `USER`, `ADMIN` | Check if the authenticated user has already applied (`{ "applied": true/false }`). |
| `GET` | `/api/my-applications` | `USER`, `ADMIN` | Retrieve all job applications submitted by the logged-in candidate. |
| `GET` | `/api/jobs/{id}/applications` | `ADMIN` only | Retrieve all candidate applications submitted for a specific job post. |
| `GET` | `/api/applications` | `ADMIN` only | Retrieve all candidate applications across all jobs in the platform. |

---

## 🚢 Cloud Deployment Overview

### Backend (Render)
- **Deployment Type:** Native Web Service (Java 17/21)
- **Build Command:** `./mvnw clean package -DskipTests`
- **Start Command:** `java -jar target/HireHub_App.jar`
- **Environment Variables:** Set `DB_URL` (`jdbc:postgresql://...`), `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `JWT_EXPIRATION`, `CORS_ALLOWED_ORIGINS` (`https://hire-hub-frontend-psi.vercel.app`), `JPA_DDL_AUTO`, and `SHOW_SQL=false`. Note that `PORT` is automatically injected by Render.

### Frontend (Vercel)
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variable:** `VITE_API_BASE_URL=https://<your-backend-domain>.onrender.com/api` (must include `/api` suffix and must be configured before triggering the build).
- **SPA Rewrite:** Handled via `frontend/vercel.json`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork the Repository**
2. **Create a Feature Branch:**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes:**
   ```bash
   git commit -m "Add some AmazingFeature"
   ```
4. **Push to the Branch:**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

---

<div align="center">
  <sub>Built with ❤️ by the HireHub Team. If you find this project useful, feel free to give it a ⭐ on GitHub!</sub>
</div>
