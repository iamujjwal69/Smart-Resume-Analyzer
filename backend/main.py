from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import json

load_dotenv() # Load environment variables from .env file
from services.pdf_service import extract_text_from_pdf_bytes
from services.nlp_service import (
    calculate_match, 
    generate_cover_letter_from_llm,
    tailor_resume,
    generate_interview_questions,
    generate_roadmap,
    generate_company_insights
)

app = FastAPI(title="Smart Resume Analyzer API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Smart Resume Analyzer API"}

@app.post("/api/analyze")
async def analyze_resume(resume: UploadFile = File(...), job_description: str = Form(...)):
    if not resume.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    try:
        pdf_bytes = await resume.read()
        resume_text = extract_text_from_pdf_bytes(pdf_bytes)
        
        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract any text from the PDF. It might be scanned or empty.")
            
        result_str = calculate_match(resume_text, job_description)
        
        # If result is a dict (fallback case), use it directly. Otherwise parse JSON string.
        result_dict = result_str if isinstance(result_str, dict) else json.loads(result_str)
        
        return {
            "status": "success",
            "data": result_dict
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/cover-letter")
async def generate_cover_letter(
    resume: UploadFile = File(...), 
    job_description: str = Form(...),
    company: str = Form(...),
    role: str = Form(...)
):
    if not resume.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    try:
        pdf_bytes = await resume.read()
        resume_text = extract_text_from_pdf_bytes(pdf_bytes)
        
        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract any text from the PDF.")
            
        cover_letter_text = generate_cover_letter_from_llm(resume_text, job_description, company, role)
        
        return {
            "status": "success",
            "data": {
                "cover_letter": cover_letter_text
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/resume/tailor")
async def tailor_resume_endpoint(resume: UploadFile = File(...), job_description: str = Form(...)):
    if not resume.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    try:
        pdf_bytes = await resume.read()
        resume_text = extract_text_from_pdf_bytes(pdf_bytes)
        result = tailor_resume(resume_text, job_description)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/interview/generate")
async def generate_interview_endpoint(resume: UploadFile = File(...), job_description: str = Form(...)):
    if not resume.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    try:
        pdf_bytes = await resume.read()
        resume_text = extract_text_from_pdf_bytes(pdf_bytes)
        result = generate_interview_questions(resume_text, job_description)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/roadmap/generate")
async def generate_roadmap_endpoint(missing_skills: str = Form(...), target_role: str = Form(...)):
    try:
        result = generate_roadmap(missing_skills, target_role)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/company/insights")
async def get_company_insights_endpoint(company_name: str = Form(...)):
    try:
        result = generate_company_insights(company_name)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
