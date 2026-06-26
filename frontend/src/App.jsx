import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [theme, setTheme] = useState('light');
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jobDescription) {
      setError("Please provide both a resume PDF and a job description.");
      return;
    }

    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", jobDescription);

    try {
      const response = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Analysis failed.");
      }

      const data = await response.json();
      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <header className="hero-section">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
        <div className="hero-content">
          <h1>Smart Resume Analyzer</h1>
          <p>Match your resume against any job description to conquer the ATS. Get instant, AI-driven feedback and score your application before you apply.</p>
        </div>
        <div className="hero-image-wrapper">
          <img src="/hero.png" alt="Resume Analyzer Illustration" className="hero-image float-animation" />
        </div>
      </header>

      <main className="main-content">
        {!result ? (
          <div className="input-section glass-panel fade-in">
            <div className="upload-group">
              <label>1. Upload Resume (PDF)</label>
              <div className="file-drop-area">
                <input type="file" accept=".pdf" onChange={handleFileChange} />
                <p>{file ? file.name : "Drag & drop your PDF or click to browse"}</p>
              </div>
            </div>

            <div className="jd-group">
              <label>2. Paste Job Description</label>
              <textarea 
                placeholder="Paste the target job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={8}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              className="analyze-btn" 
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Match"}
            </button>
          </div>
        ) : (
          <div className="results-section fade-in">
            <button className="back-btn" onClick={() => setResult(null)}>← Analyze Another</button>
            
            <div className="score-card glass-panel">
              <div className="score-circle">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path className="circle-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path className="circle"
                    strokeDasharray={`${result.match_score}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="score-content">
                  <span className="score-value">{result.match_score}%</span>
                  <span className="score-label">Match Score</span>
                </div>
              </div>

              <div className="suggestions-list">
                <h3>Improvement Plan</h3>
                <ul>
                  {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>

            <div className="skills-breakdown">
              <div className="skills-panel glass-panel">
                <h3>Matched Required Skills</h3>
                <div className="chip-container">
                  {result.resume_skills.map((skill, i) => (
                    result.jd_skills.includes(skill) ? 
                    <span key={i} className="chip success">{skill}</span> : null
                  ))}
                  {result.resume_skills.filter(s => result.jd_skills.includes(s)).length === 0 && (
                    <p className="no-skills">No crucial skills matched.</p>
                  )}
                </div>
              </div>

              <div className="skills-panel glass-panel">
                <h3>Missing Skills</h3>
                <div className="chip-container">
                  {result.missing_skills.length > 0 ? result.missing_skills.map((skill, i) => (
                    <span key={i} className="chip danger">{skill}</span>
                  )) : <p className="all-good">You have all the required skills!</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
