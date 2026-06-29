# Smart Resume Analyzer (CareerOS)

**🚀 Live Demo:** [https://mycareer-os69.vercel.app/](https://mycareer-os69.vercel.app/)
## 📖 Project Overview
**Smart Resume Analyzer**, also branded as **CareerOS**, is a modern, AI‑powered web application that helps job seekers **craft, evaluate, and improve their resumes, cover letters, and interview preparation**. It combines a sleek, glassmorphic UI with powerful backend services (OpenAI, Clerk authentication, Prisma, and custom NLP pipelines) to deliver instant, data‑driven feedback.

---

## 🌍 Real‑World Problem It Solves
- **Time‑Consuming Manual Review** – Job applicants usually spend hours refining their CVs or rely on expensive career coaches.
- **Lack of Objective Metrics** – Traditional ATS (Applicant Tracking Systems) give opaque scores; candidates have no clear way to know why they are rejected.
- **Inefficient Interview Prep** – Simulated interview experiences and personalized feedback are rare and costly.
- **Fragmented Tools** – Resumes, cover letters, and interview simulations are often separate services, forcing users to switch between platforms.

CareerOS solves these pain points by providing a **single, unified platform** that:
1. Parses resumes and extracts structured data via **NLP services**.
2. Generates **ATS‑compatible scores** using OpenAI models.
3. Suggests **real‑time improvements** (keywords, formatting, achievements).
4. Produces **custom cover letters** and **mock interview scripts**.
5. Stores user history securely while allowing **export** for job applications.

---

## 🛠️ Tech Stack & Why We Chose It
| Layer | Technology | Reason for Choice |
|------|------------|-------------------|
| **Frontend** | **Next.js (React framework)** – TypeScript, vanilla CSS, custom design system (glassmorphism, dynamic animations) | Server‑Side Rendering for SEO, fast static generation, built‑in routing, and easy integration with Vercel. |
| | **React 18** – Hooks, Context API, Server Components | Modern component model, excellent ecosystem, easy state management. |
| | **Prisma ORM** (`@prisma/client`) | Type‑safe database access, auto‑generation of TypeScript types, migrations built‑in. |
| | **Clerk** (authentication) | Quick, secure user management (social login, email magic links) without writing auth code. |
| | **OpenAI API** (gpt‑4o, embeddings) | Generates ATS scores, cover‑letter drafts, interview scripts – state‑of‑the‑art language model. |
| **Backend** | **FastAPI (Python 3.11)** | High‑performance async framework, auto‑generated OpenAPI docs, easy integration with Pydantic models. |
| | **Python NLP Service** (`nlp_service.py`) – spaCy + custom pipelines | Precise entity extraction, keyword identification, and resume parsing. |
| | **PDF Service** (`pdf_service.py`) – PyMuPDF | Direct PDF parsing/upload handling. |
| **Database** | **PostgreSQL (managed on Render)** | Relational storage for users, resumes, analytics; powerful full‑text search & JSONB support. |
| **Containerization** | **Docker** (backend Dockerfile) | Guarantees reproducible environment across Render, Fly.io or any VPS. |
| **CI/CD** | **GitHub Actions** (`.github/workflows/deploy.yml`) | Automated builds/deploys to Vercel (frontend) and Render (backend) on every push to `main`. |
| **Hosting** | **Vercel** (frontend) – free tier | Optimized for Next.js, automatic CDN, instant rollbacks. |
| | **Render** (backend) – free tier Docker service + managed PostgreSQL | Simple Docker deployment, auto‑scaling, easy secret management. |
| **Design System** | **Vanilla CSS** with custom tokens (HSL palettes, glass‑morphism, micro‑animations) | Full control over premium UI, no Tailwind dependency, lightweight bundle. |
| **Testing** | **Jest + React Testing Library** (frontend) • **pytest** (backend) | Unit & integration testing for reliability. |
| **Version Control** | **Git** – hosted on GitHub | Collaboration, PR workflow, source‑code history. |

---

## 🚀 Features
- **Resume Upload & Parsing** – Drag‑and‑drop PDF/Word; instantly extracts sections, experiences, skills.
- **ATS Score Simulator** – Shows a percentage score and highlights missing keywords.
- **Cover‑Letter Generator** – One‑click AI‑crafted cover letters tailored to a job description.
- **Mock Interview Engine** – Generates interview questions, records user answers, provides feedback.
- **Career Roadmap** – Suggests skill‑gap analysis and learning resources.
- **Dashboard & History** – Visualize past submissions, scores over time, and download PDFs.
- **Secure Auth** – Clerk handles social logins, email verification, and session management.
- **Responsive Premium UI** – Dark mode, glass‑morphism cards, subtle micro‑animations, and custom typography (Inter).

---

## 📂 Repository Structure
```
Smart-Resume-Analyzer/
├─ backend/                 # FastAPI backend & Python services
│   ├─ Dockerfile           # Docker image for Render
│   ├─ main.py              # FastAPI entry point
│   ├─ requirements.txt     # Python deps
│   └─ services/            # nlp_service.py, pdf_service.py
├─ web/                     # Next.js frontend (typescript)
│   ├─ src/
│   │   ├─ app/            # Routes (dashboard, API proxy, auth)
│   │   ├─ components/     # UI components (cards, tabs, dialogs)
│   │   ├─ lib/            # Prisma client, utils
│   │   └─ middleware.ts   # API middleware (auth, rate‑limit)
│   ├─ public/             # Images, icons, hero visuals
│   ├─ next.config.ts      # Vercel rewrites for /api/* → Render
│   ├─ vercel.json          # Vercel deployment config
│   └─ package.json        # NPM scripts, deps
├─ render.yaml              # Render service definition (Docker)
├─ .github/workflows/       # CI/CD pipelines
│   └─ deploy.yml
├─ README_DEPLOYMENT.md    # Detailed deployment guide (this repo)
└─ .env.example            # Template for required environment variables
```

---

## ⚙️ Installation & Local Development
1. **Clone the repo**
   ```bash
   git clone https://github.com/iamujjwal69/Smart-Resume-Analyzer.git
   cd Smart-Resume-Analyzer
   ```
2. **Create a `.env` file** (copy from `.env.example`) and fill in:
   - `DATABASE_URL`
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
3. **Frontend**
   ```bash
   cd web
   npm install
   npm run dev   # http://localhost:3000
   ```
4. **Backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate   # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   uvicorn main:app --reload   # http://localhost:8000
   ```
5. **Database migrations** (Prisma)
   ```bash
   cd web
   npx prisma migrate dev --name init
   ```
6. **Run tests**
   - Frontend: `npm test`
   - Backend: `pytest`

---

## 📦 Deployment
### Frontend → Vercel
1. Sign up at **vercel.com** and import the GitHub repository.
2. Vercel automatically detects the Next.js app.
3. Add the env vars (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `OPENAI_API_KEY`, `DATABASE_URL`).
4. Deploy – Vercel will provide a URL like `https://career‑os.vercel.app`.

### Backend → Render
1. Sign up at **render.com**.
2. Create a **PostgreSQL** service (free tier) – note the connection string.
3. Create a **Web Service** → Docker → point to `backend/Dockerfile`.
4. Set the same env vars as above.
5. Deploy – Render gives you an endpoint such as `https://career‑os-backend.onrender.com`.

### Connect Frontend ↔ Backend
- The `vercel.json` file contains a rewrite rule that proxies all `/api/*` requests to the Render backend URL. After the backend is live, update the placeholder in `vercel.json` (or run the provided `setup_deploy.sh` script) and redeploy.

---

## 🔐 Environment Variables
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (Render provides this). |
| `OPENAI_API_KEY` | Access token for OpenAI GPT‑4o / embeddings. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Public key for Clerk authentication (exposed to the browser). |
| `CLERK_SECRET_KEY` | Private Clerk key (server‑side only). |
| `PORT` *(optional)* | Port for FastAPI (Render sets this automatically). |

---

## 📚 Documentation & API
- **FastAPI OpenAPI docs**: `https://<backend‑url>/docs` – interactive Swagger UI.
- **Next.js API routes**: located under `web/src/app/api/*` (mostly proxies to the backend).
- **Design System**: See `web/src/styles/` for token definitions (colors, spacing, typography).

---

## 🤝 Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/awesome-feature`).
3. Write tests for your changes.
4. Submit a Pull Request – CI will run linting, tests, and preview deployment on Vercel.

---

## 📄 License
This project is licensed under the **MIT License** – see `LICENSE` file.

---

## 🙏 Acknowledgments
- **OpenAI** for the language models powering the analytics.
- **Clerk** for frictionless authentication.
- **Render** for easy Docker hosting and managed PostgreSQL.
- **Vercel** for the performant Next.js deployment platform.
- **Prisma** for making database interactions type‑safe and pleasant.

---

*Happy building! 🚀*
