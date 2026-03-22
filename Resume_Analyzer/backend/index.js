const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

const PORT = 3000;

app.use(express.json());

async function parsePdfText(buffer) {
  try {
    const parsed = await pdfParse(buffer);
    if (parsed?.text) {
      return parsed.text.trim();
    }
  } catch (error) {
    console.warn('pdf-parse failed, trying pdfjs fallback:', error.message);
  }

  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const data = buffer instanceof ArrayBuffer
    ? buffer
    : buffer instanceof Uint8Array
      ? buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
      : buffer.buffer;
  const doc = await pdfjs.getDocument({ data }).promise;
  let fullText = '';

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText.trim();
}

function extractSkillsFromText(text) {
  const likelySkills = [
    'javascript', 'python', 'java', 'c#', 'c++', 'ruby', 'go', 'typescript',
    'react', 'angular', 'vue', 'node', 'express', 'spring', 'django', 'flask',
    'sql', 'mongodb', 'postgresql', 'aws', 'azure', 'gcp', 'docker', 'kubernetes',
    'machine learning', 'data science', 'nlp', 'deep learning', 'devops',
    'agile', 'scrum', 'project management', 'qa', 'testing'
  ];

  const normalized = text.toLowerCase();
  const found = new Set();

  likelySkills.forEach(skill => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\b${escaped}\\b`, 'i');
    if (re.test(normalized)) {
      found.add(skill);
    }
  });

  return Array.from(found);
}

function computeRelevanceHeuristic(resumeSkills, jobDescription) {
  const jobNormalized = jobDescription.toLowerCase();
  const jobSkills = extractSkillsFromText(jobDescription);
  const matched = resumeSkills.filter(skill => jobSkills.includes(skill));
  const score = jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 0;
  const analysis = `Matched ${matched.length} out of ${jobSkills.length} required skills: ${matched.join(', ')}`;
  return { score, analysis };
}

function generateSummaryHeuristic(resumeText) {
  const sentences = resumeText.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const summary = sentences.slice(0, 3).join('. ').trim() + '.';
  return summary;
}

app.post('/analyse', upload.single('resume'), async (req, res) => {
  try {
    const jobDescription = req.body.jobDescription;
    if (!req.file || !jobDescription) {
      return res.status(400).json({ error: 'Required fields: resume file + jobDescription' });
    }

    const stats = fs.statSync(req.file.path);
    console.log('uploaded resume path', req.file.path, 'size', stats.size);
    const dataBuffer = fs.readFileSync(req.file.path);
    const hash = require('crypto').createHash('sha256').update(dataBuffer).digest('hex');
    console.log('buffer sha256', hash);

    const resumeText = await parsePdfText(dataBuffer);

    if (!resumeText) {
      return res.status(422).json({ error: 'Could not extract text from PDF' });
    }

    const skills = extractSkillsFromText(resumeText);
    const summary = generateSummaryHeuristic(resumeText);
    const relevance = computeRelevanceHeuristic(skills, jobDescription);

    return res.json({
      status: 'ok',
      resumeTextLength: resumeText.length,
      skills: skills,
      summary: summary,
      relevance: {
        score: relevance.score,
        analysis: relevance.analysis
      }
    });
  } catch (error) {
    console.error('analyse error', error);
    res.status(500).json({ error: 'Internal server error', detail: error.message });
  } finally {
    // For debugging, keep uploaded file to inspect parse issues. Remove in production.
    // if (req.file) {
    //   fs.unlink(req.file.path, () => {});
    // }
  }
});

app.get('/', (req, res) => {
  res.send('Resume analyzer service running. POST /analyse with multipart form data (resume, jobDescription).');
});

app.listen(PORT, () => {
  console.log(`Resume analyzer listening at http://localhost:${PORT}`);
});