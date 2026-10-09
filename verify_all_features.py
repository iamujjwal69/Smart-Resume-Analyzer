import sys
import time
import json
import urllib.request
import urllib.parse
from datetime import datetime

if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

PASS = "[PASS]"
FAIL = "[FAIL]"

results = []

def run_test(name, fn):
    print(f"[*] Running: {name} ... ", end="", flush=True)
    start = time.time()
    try:
        detail = fn()
        duration = round((time.time() - start) * 1000, 1)
        print(f"\r{PASS} : {name} ({duration}ms)")
        if detail:
            print(f"    |-- Details: {detail}")
        results.append((name, True, duration, detail))
    except Exception as e:
        duration = round((time.time() - start) * 1000, 1)
        print(f"\r{FAIL} : {name} ({duration}ms)")
        print(f"    |-- Error: {e}")
        results.append((name, False, duration, str(e)))

def get_valid_sample_pdf():
    return b"""%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 120 >>
stream
BT
/F1 12 Tf
72 712 Td
(John Doe - Software Engineer with React, TypeScript, Python, AWS experience.) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000228 00000 n 
0000000305 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
475
%%EOF"""

def make_multipart_body(fields, files):
    boundary = '----CareerOSTestBoundary7MA4YW'
    body = bytearray()
    for name, value in fields.items():
        body.extend(f'--{boundary}\r\n'.encode())
        body.extend(f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode())
        body.extend(f'{value}\r\n'.encode())
    for name, (filename, content, content_type) in files.items():
        body.extend(f'--{boundary}\r\n'.encode())
        body.extend(f'Content-Disposition: form-data; name="{name}"; filename="{filename}"\r\n'.encode())
        body.extend(f'Content-Type: {content_type}\r\n\r\n'.encode())
        body.extend(content)
        body.extend(b'\r\n')
    body.extend(f'--{boundary}--\r\n'.encode())
    headers = {'Content-Type': f'multipart/form-data; boundary={boundary}'}
    return bytes(body), headers

def test_fastapi_backend():
    req = urllib.request.Request("http://127.0.0.1:8000/")
    with urllib.request.urlopen(req, timeout=5) as res:
        assert res.status == 200
        data = json.loads(res.read().decode())
        assert "message" in data
        return f"FastAPI alive -> '{data['message']}'"

def test_nextjs_frontend():
    req = urllib.request.Request("http://localhost:3000/")
    with urllib.request.urlopen(req, timeout=5) as res:
        assert res.status == 200
        return "Next.js 16 (Turbopack) loaded successfully (HTTP 200)"

def test_backend_proxy_connectivity():
    data = urllib.parse.urlencode({
        "missing_skills": "Next.js, TypeScript",
        "target_role": "Full Stack Engineer"
    }).encode()
    req = urllib.request.Request(
        "http://localhost:3000/api/backend/roadmap/generate",
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    with urllib.request.urlopen(req, timeout=8) as res:
        assert res.status == 200
        data = json.loads(res.read().decode())
        assert data.get("status") == "success"
        return "Next.js internal proxy communicating seamlessly with FastAPI"

def test_resume_analyze():
    pdf_bytes = get_valid_sample_pdf()
    body, headers = make_multipart_body(
        fields={"job_description": "Senior React/Node Full Stack Engineer with AWS knowledge."},
        files={"resume": ("resume.pdf", pdf_bytes, "application/pdf")}
    )
    req = urllib.request.Request("http://localhost:3000/api/backend/analyze", data=body, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as res:
        assert res.status == 200
        res_data = json.loads(res.read().decode())
        assert res_data.get("status") == "success"
        info = res_data.get("data", {})
        score = info.get("ats_score")
        keywords = info.get("missing_keywords", [])
        assert score is not None
        assert len(keywords) > 0
        return f"ATS Score: {score}/100 | Keywords: {', '.join(keywords[:4])} | Suggestions: {len(info.get('suggestions', []))}"

def test_resume_tailor():
    pdf_bytes = get_valid_sample_pdf()
    body, headers = make_multipart_body(
        fields={"job_description": "Staff Engineer needing high scalability & distributed architecture."},
        files={"resume": ("my_resume.pdf", pdf_bytes, "application/pdf")}
    )
    req = urllib.request.Request("http://localhost:3000/api/backend/resume/tailor", data=body, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as res:
        assert res.status == 200
        res_data = json.loads(res.read().decode())
        assert res_data.get("status") == "success"
        tailored = res_data.get("data", {})
        assert "tailored_bullets" in tailored
        assert len(tailored["tailored_bullets"]) >= 3
        return f"Generated {len(tailored['tailored_bullets'])} STAR-format bullet points"

def test_cover_letter():
    pdf_bytes = get_valid_sample_pdf()
    body, headers = make_multipart_body(
        fields={
            "company": "Google",
            "role": "Cloud Architect",
            "job_description": "Leading distributed cloud infrastructure solutions"
        },
        files={"resume": ("resume.pdf", pdf_bytes, "application/pdf")}
    )
    req = urllib.request.Request("http://localhost:3000/api/backend/cover-letter", data=body, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as res:
        assert res.status == 200
        res_data = json.loads(res.read().decode())
        assert res_data.get("status") == "success"
        letter = res_data.get("data", {}).get("cover_letter", "")
        assert len(letter) > 100
        return f"Generated tailored cover letter for Google ({len(letter)} characters)"

def test_interview_prep():
    pdf_bytes = get_valid_sample_pdf()
    body, headers = make_multipart_body(
        fields={"job_description": "Lead Platform Engineer"},
        files={"resume": ("resume.pdf", pdf_bytes, "application/pdf")}
    )
    req = urllib.request.Request("http://localhost:3000/api/backend/interview/generate", data=body, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as res:
        assert res.status == 200
        res_data = json.loads(res.read().decode())
        assert res_data.get("status") == "success"
        questions = res_data.get("data", {}).get("questions", [])
        assert len(questions) >= 3
        return f"Generated {len(questions)} tailored mock interview questions"

def test_learning_roadmap():
    data = urllib.parse.urlencode({
        "missing_skills": "Kubernetes, Terraform, System Design",
        "target_role": "Principal DevOps Architect"
    }).encode()
    req = urllib.request.Request(
        "http://localhost:3000/api/backend/roadmap/generate",
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    with urllib.request.urlopen(req, timeout=8) as res:
        assert res.status == 200
        res_data = json.loads(res.read().decode())
        assert res_data.get("status") == "success"
        steps = res_data.get("data", {}).get("roadmap", [])
        assert len(steps) >= 3
        return f"Generated {len(steps)}-milestone career learning roadmap"

def test_company_insights():
    payload = json.dumps({"companyName": "Microsoft"}).encode()
    req = urllib.request.Request(
        "http://localhost:3000/api/company/insights/fetch",
        data=payload,
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=10) as res:
        assert res.status == 200
        res_data = json.loads(res.read().decode())
        assert res_data.get("status") == "completed"
        company = res_data.get("data", {})
        assert company.get("name") == "Microsoft"
        assert "techStack" in company
        return f"Company: {company['name']} | Culture Score: {company.get('cultureScore')} | Salary: INR {company.get('averageSalary'):,}"

def test_auth_protection():
    req = urllib.request.Request("http://localhost:3000/api/scans")
    try:
        with urllib.request.urlopen(req, timeout=5) as res:
            assert res.status == 401
    except urllib.error.HTTPError as e:
        assert e.code == 401
        return "Protected route /api/scans correctly returned 401 Unauthorized for unauthenticated requests"

def main():
    print("=" * 72)
    print("   CAREEROS / SMART RESUME ANALYZER - VERIFICATION TEST SUITE")
    print(f"   Execution Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 72)
    print()

    run_test("1. FastAPI Python Backend Service", test_fastapi_backend)
    run_test("2. Next.js Web Frontend Server", test_nextjs_frontend)
    run_test("3. Unified API Proxy Route (/api/backend/*)", test_backend_proxy_connectivity)
    run_test("4. Resume Parsing & ATS Analyzer (/api/backend/analyze)", test_resume_analyze)
    run_test("5. Resume Tailoring Engine (/api/backend/resume/tailor)", test_resume_tailor)
    run_test("6. AI Cover Letter Generator (/api/backend/cover-letter)", test_cover_letter)
    run_test("7. AI Mock Interview Prep (/api/backend/interview/generate)", test_interview_prep)
    run_test("8. Career Learning Roadmap (/api/backend/roadmap/generate)", test_learning_roadmap)
    run_test("9. Company Research & Insights (/api/company/insights/fetch)", test_company_insights)
    run_test("10. Clerk Authentication Gate (/api/scans)", test_auth_protection)

    print()
    print("=" * 72)
    passed_count = sum(1 for _, ok, _, _ in results if ok)
    total_count = len(results)
    if passed_count == total_count:
        print(f"ALL {total_count}/{total_count} TESTS PASSED SUCCESSFULLY! (100% OPERATIONAL)")
    else:
        print(f"{total_count - passed_count} TESTS FAILED out of {total_count}.")
    print("=" * 72)

if __name__ == "__main__":
    main()
