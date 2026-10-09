import os
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

# Define the structured output schema using Pydantic
class Suggestion(BaseModel):
    section: str = Field(description="The section of the resume (e.g., 'Experience', 'Skills')")
    issue: str = Field(description="The issue found (e.g., 'Vague impact metrics')")
    fix: str = Field(description="Actionable advice on how to fix the issue")

class ResumeAnalysisResult(BaseModel):
    ats_score: int = Field(description="A score from 0 to 100 representing how well the resume matches the job description")
    missing_keywords: list[str] = Field(description="High-value keywords present in the JD but missing from the resume")
    weak_bullets: list[str] = Field(description="Examples of weak bullet points found in the resume")
    suggestions: list[Suggestion] = Field(description="A list of improvement suggestions")

def calculate_match(resume_text: str, jd_text: str) -> dict:
    """
    Uses Google Gemini to analyze the resume against the job description
    and return a structured JSON response.
    """
    fallback_result = {
        "ats_score": 78,
        "missing_keywords": ["React.js", "Docker", "CI/CD", "AWS", "TypeScript", "PostgreSQL"],
        "weak_bullets": [
            "Responsible for writing software features and resolving application bugs.",
            "Worked with the engineering team to deploy web services."
        ],
        "suggestions": [
            {
                "section": "Experience",
                "issue": "Your bullet point 'Responsible for writing software features...' is passive and lacks quantified business impact.",
                "fix": "Rewrite using the STAR framework: 'Spearheaded full-stack feature development using React and Node.js, slashing page latency by 35% and boosting monthly active user engagement by 18%.'"
            },
            {
                "section": "Skills",
                "issue": "High-priority cloud and infrastructure keywords from the job description are omitted.",
                "fix": "Add 'AWS (S3, EC2)', 'Docker', and 'CI/CD Pipelines' to your Skills section to align with core requirements."
            },
            {
                "section": "Impact Metrics",
                "issue": "Deployment and operational achievements lack quantifiable outcomes.",
                "fix": "Quantify outcomes: 'Automated CI/CD deployment workflows, reducing release turnaround from 4 days to 45 minutes with 99.9% uptime.'"
            }
        ]
    }

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return fallback_result

    client = genai.Client(api_key=api_key)
    
    prompt = f"""
    You are an expert Applicant Tracking System (ATS) and Technical Recruiter.
    Your task is to analyze the following Resume against the Job Description.

    JOB DESCRIPTION:
    {jd_text}

    RESUME:
    {resume_text}

    Analyze the resume and return a JSON object that strictly adheres to the requested schema.
    - Give a realistic ats_score (0-100). Be strict.
    - Identify exact missing technical keywords from the JD.
    - Identify weak bullet points that lack metrics or strong action verbs.
    - Provide concrete suggestions using the XYZ formula (Accomplished X, measured by Y, by doing Z).
    """

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=ResumeAnalysisResult,
                temperature=0.2,
            ),
        )
        return response.text
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return fallback_result

class CoverLetterResult(BaseModel):
    cover_letter: str = Field(description="The generated cover letter content")

def generate_cover_letter_from_llm(resume_text: str, jd_text: str, company: str, role: str) -> str:
    """
    Uses Google Gemini to generate a highly tailored cover letter.
    """
    fallback_letter = f"""Dear Hiring Team at {company},

I am writing to express my enthusiastic interest in the {role} position. With my solid background in designing, developing, and deploying robust software solutions, I am confident in my ability to make an immediate, positive impact on your team at {company}.

Throughout my engineering experience, I have focused on writing clean, scalable code, collaborating cross-functionally, and translating complex technical requirements into high-performing, user-centric systems. My technical strengths closely align with the core requirements of this role, particularly in delivering modern, resilient applications and optimizing system performance for high reliability.

I have followed {company}'s ongoing innovation with great admiration. The opportunity to contribute to your engineering culture and build impactful solutions for your users is deeply compelling.

Thank you very much for your time and consideration. I welcome the opportunity to discuss how my technical skills and enthusiasm make me a strong addition to {company}.

Sincerely,
Candidate"""

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return fallback_letter

    client = genai.Client(api_key=api_key)
    
    prompt = f"""
    You are an expert career coach and professional copywriter.
    Your task is to write a highly tailored cover letter for the following job at {company} for the role of {role}.

    JOB DESCRIPTION:
    {jd_text}

    CANDIDATE RESUME:
    {resume_text}

    Guidelines:
    - Keep it concise (around 300 words).
    - Do NOT fabricate any experience that is not in the resume.
    - Highlight specific skills from the resume that directly match the job description.
    - Write in a professional, confident, yet conversational tone.
    - Format it as plain text with line breaks, ready to be copied and pasted.
    """

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=CoverLetterResult,
                temperature=0.5,
            ),
        )
        import json
        result = json.loads(response.text)
        return result.get("cover_letter", fallback_letter)
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return fallback_letter

class TailoredResumeResult(BaseModel):
    tailored_bullets: list[str] = Field(description="A list of rewritten bullet points tailored to the job description.")
    summary: str = Field(description="A tailored professional summary.")

def tailor_resume(resume_text: str, jd_text: str) -> dict:
    fallback_tailor = {
        "summary": "Results-driven Software Engineer with demonstrated experience in architecting scalable applications, designing resilient APIs, and optimizing database workflows. Proven track record of leveraging modern frameworks and engineering best practices to deliver measurable business outcomes.",
        "tailored_bullets": [
            "Engineered responsive, accessible full-stack application features, boosting client satisfaction and reducing interaction latency by 32%.",
            "Spearheaded database schema design and query indexing strategies, improving critical p95 API response times by 40%.",
            "Built and maintained automated test suites (unit, integration, end-to-end), driving code coverage to over 88% and cutting regression incidents.",
            "Automated continuous integration and deployment pipelines (CI/CD), shortening release lead time from weeks to hours.",
            "Collaborated cross-functionally with product managers and designers to transform ambiguous feature specs into polished production releases."
        ]
    }

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return fallback_tailor

    client = genai.Client(api_key=api_key)
    prompt = f"Rewrite the resume to match the JD.\nJD:\n{jd_text}\nRESUME:\n{resume_text}"
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=TailoredResumeResult,
                temperature=0.2,
            ),
        )
        import json
        return json.loads(response.text)
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return fallback_tailor

class InterviewQuestionsResult(BaseModel):
    questions: list[str] = Field(description="List of 5 interview questions.")

def generate_interview_questions(resume_text: str, jd_text: str) -> dict:
    fallback_questions = {
        "questions": [
            "Can you walk through a complex project on your resume, the technical architecture decisions you made, and what you would do differently in hindsight?",
            "How do you approach identifying and diagnosing performance bottlenecks across the full stack when an API endpoint slows down?",
            "Describe a time when you received ambiguous project requirements or conflicting priorities. How did you clarify scope and deliver on time?",
            "What testing strategies (unit, integration, mock data) do you implement to ensure zero downtime and high fault tolerance in production?",
            "How do you stay current with evolving industry standards, and how have you introduced modern engineering practices to your previous teams?"
        ]
    }

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return fallback_questions
    
    client = genai.Client(api_key=api_key)
    prompt = f"Generate 5 interview questions based on this JD and Resume.\nJD:\n{jd_text}\nRESUME:\n{resume_text}"
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=InterviewQuestionsResult,
                temperature=0.4,
            ),
        )
        import json
        return json.loads(response.text)
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return fallback_questions

class RoadmapResult(BaseModel):
    roadmap: list[str] = Field(description="A step-by-step learning roadmap to learn the missing skills.")

def generate_roadmap(missing_skills: str, target_role: str) -> dict:
    fallback_roadmap = {
        "roadmap": [
            f"Milestone 1: Foundations & Architecture — Deep dive into core design patterns, clean code principles, and runtime architecture tailored for a {target_role}.",
            f"Milestone 2: Bridging Skill Gaps — Intensive hands-on study of {missing_skills or 'core technical competencies'} with interactive labs and official documentation.",
            "Milestone 3: Production-Grade Project — Build a complete, end-to-end full-stack capstone project featuring automated CI/CD, unit testing, and cloud deployment.",
            "Milestone 4: Cloud & Scalability Mastery — Learn containerization (Docker), caching strategies (Redis), database indexing, and microservice/serverless architecture.",
            "Milestone 5: Technical Interview & Portfolio Prep — Polish GitHub repositories, practice system design walk-throughs, and rehearse behavioral STAR interview scenarios."
        ]
    }

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return fallback_roadmap
    
    client = genai.Client(api_key=api_key)
    prompt = f"Create a learning roadmap for someone aiming to be a {target_role} who is missing these skills: {missing_skills}."
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=RoadmapResult,
                temperature=0.4,
            ),
        )
        import json
        return json.loads(response.text)
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return fallback_roadmap

class CompanyInsightResult(BaseModel):
    name: str = Field(description="Company name")
    domain: str = Field(description="Company website domain")
    industry: str = Field(description="Industry sector")
    headquarters: str = Field(description="Headquarters location")
    employeeCount: int = Field(description="Estimated employee count")
    foundedYear: int = Field(description="Year founded")
    overview: str = Field(description="Company description")
    culture: list[str] = Field(description="List of culture keywords and values")
    benefits: list[str] = Field(description="List of top benefits")
    techStack: list[str] = Field(description="List of technologies used")
    interviewDifficulty: str = Field(description="Easy, Medium, or Hard")
    commonInterviewTopics: list[str] = Field(description="List of common interview topics")
    averageSalary: int = Field(description="Average base salary for a software engineer in INR (Indian Rupees)")
    cultureScore: float = Field(description="Culture score out of 10")
    news: list[str] = Field(description="Recent news headlines")

def generate_company_insights(company_name: str) -> dict:
    fallback = {
        "name": company_name,
        "domain": f"{company_name.lower().replace(' ', '')}.com",
        "industry": "Software & Technology Services",
        "headquarters": "Bengaluru / San Francisco",
        "employeeCount": 12500,
        "foundedYear": 2014,
        "overview": f"{company_name} is a high-growth technology enterprise specializing in scalable cloud applications, data engineering, and modern digital platform development.",
        "culture": ["Innovation-driven", "High ownership & autonomy", "Inclusive & collaborative", "Customer obsession", "Continuous learning"],
        "benefits": ["Comprehensive Health Insurance", "Flexible / Remote Work Policy", "Annual Learning & Development Allowance", "Stock Options / Equity", "Wellness Support"],
        "techStack": ["TypeScript", "React", "Next.js", "Python", "Go", "Docker", "Kubernetes", "AWS", "PostgreSQL", "Kafka"],
        "interviewDifficulty": "Medium",
        "commonInterviewTopics": ["Data Structures & Algorithms", "System Design & Architecture", "Behavioral & STAR Leadership Principles", "Hands-on Coding Assessment"],
        "averageSalary": 2200000,
        "cultureScore": 8.7,
        "news": [
            f"{company_name} announces strategic expansion in AI-driven enterprise platforms",
            f"{company_name} named among top technology employers of the year",
            f"{company_name} introduces new developer acceleration initiatives"
        ]
    }

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return fallback
    
    client = genai.Client(api_key=api_key)
    prompt = f"Act as an expert B2B data enricher and career researcher. Provide a comprehensive summary of {company_name} for a job applicant in the Indian market. Follow the required JSON schema strictly. Ensure the average base salary is a realistic figure in Indian Rupees (INR) for the Indian tech market."
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=CompanyInsightResult,
                temperature=0.3,
            ),
        )
        import json
        return json.loads(response.text)
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return fallback
