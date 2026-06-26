# Smart Resume Analyzer 🚀

Smart Resume Analyzer is an intelligent platform designed to analyze resumes, provide tailored feedback, and help candidates prepare for interviews. Built with modern web technologies, it features an intuitive dashboard, seamless authentication, and AI-driven insights.

## ✨ Features

- **Resume Parsing & Analysis:** Upload your resume to get instant, AI-driven feedback.
- **Tailored Recommendations:** Receive personalized suggestions to improve your resume structure, wording, and impact.
- **Interview Preparation:** Access mock interview questions based on your resume and target role.
- **Interactive Dashboard:** Manage your uploaded resumes, view past analyses, and track your progress over time.
- **Secure Authentication:** User accounts and authentication powered by Clerk.

## 🛠️ Technology Stack

### Frontend / Web App
- **Framework:** Next.js 16
- **Styling:** Tailwind CSS, Shadcn UI, Class Variance Authority
- **State & Forms:** React Hook Form
- **Authentication:** Clerk
- **Database ORM:** Prisma Client

### Backend
- **Language:** Python
- **API Framework:** FastAPI / Flask (depending on configuration)
- **Deployment:** Render (Backend) & Vercel (Frontend)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- PostgreSQL (or any other configured database)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/iamujjwal69/Smart-Resume-Analyzer.git
   cd Smart-Resume-Analyzer
   ```

2. **Setup the Web Frontend:**
   ```bash
   cd web
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `web` directory and add the necessary keys (Clerk, Database URL, etc.).

4. **Run Database Migrations:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```

6. **Setup the Backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   # Start the backend server (e.g., uvicorn main:app --reload)
   ```

## 📦 Deployment

The application is configured to be deployed across two platforms:
- **Frontend (`web`):** Configured for automatic deployment on **Vercel** (`vercel.json`).
- **Backend (`backend`):** Configured for deployment on **Render** (`render.yaml`).

A convenient `setup_deploy.sh` script is provided to streamline the deployment process.

## 📄 License
This project is licensed under the MIT License.
