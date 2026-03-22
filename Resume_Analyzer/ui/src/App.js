import React, { useState } from 'react';
import './App.css';

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile || !jobDescription) {
      setError('Please provide both resume file and job description.');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await fetch('/analyse', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to analyze resume. Please check if the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Resume Analyzer</h1>
        <p>Upload your resume and enter a job description to get analysis and relevance score.</p>
      </header>

      <main className="container">
        <form onSubmit={handleSubmit} className="analyzer-form">
          <div className="form-group">
            <label htmlFor="resume">Resume (PDF):</label>
            <input
              type="file"
              id="resume"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files[0])}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="jobDescription">Job Description:</label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Enter the job description here..."
              rows="6"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {results && (
          <div className="results">
            <h2>Analysis Results</h2>

            <div className="result-section">
              <h3>Extracted Skills</h3>
              <div className="skills">
                {results.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>

            <div className="result-section">
              <h3>Resume Summary</h3>
              <p className="summary">{results.summary}</p>
            </div>

            <div className="result-section">
              <h3>Relevance Score</h3>
              <div className="score">
                <div className="score-circle" style={{'--score': results.relevance.score}}>
                  {results.relevance.score}%
                </div>
                <p className="score-text">Score: {results.relevance.score}/100</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
