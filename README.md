# AI Resume Analyzer

Turn a resume into actionable career advice. Upload a PDF (or paste text), get instant job recommendations with a composite **Fit Score (0–100)**, and a forward-looking **Future Path** that maps skills to higher-leverage roles.

> Built for speed, clarity, and practical next steps.

---

## ✨ Features

- **PDF Upload + Drag & Drop** (and **analyze-without-file** using pasted text)
- **Job Recommendations** with a composite **Fit Score** that considers:
  - Compensation potential (salary band)
  - Work–life balance (WLB)
  - Career growth & demand
  - Skill match / gaps
- **Future Path**: role ladder + skill plan (what to learn, why it matters, suggested sequence)
- **Transparent Scoring**: per-dimension subscores with weighting
- **Privacy-first**: no resumes stored by default (configurable)

---

## 🧱 Tech Stack (adjust as needed)

- **Frontend**: Next.js (TypeScript), React, Tailwind  
- **API**: Next.js Route Handlers (or Express/FastAPI—adapt if you split)  
- **Parsing**: PDF → text via server utility (e.g., `pdf-parse`) or client using `pdfjs-dist`  
- **LLM/Scoring**: Provider-agnostic service that consumes ENV keys (OpenAI/Anthropic/local—your choice)

---

## 🗂️ Project Structure

```text
.
├─ app/                         # Next.js (App Router)
│  ├─ api/
│  │  └─ analyze/route.ts       # POST /api/analyze
│  └─ (ui pages and layouts)
├─ src/
│  ├─ lib/
│  │  ├─ pdf.ts                 # PDF → text helpers
│  │  ├─ scoring.ts             # Scoring rubric & weights
│  │  └─ llm.ts                 # LLM provider wrapper
│  └─ components/
│     ├─ Dropzone.tsx
│     ├─ AnalyzerForm.tsx
│     ├─ Results.tsx
│     └─ FuturePath.tsx
├─ public/
│  └─ samples/                  # sample resumes (optional)
├─ .env.example
├─ README.md
└─ package.json
```

## 🚀 Local Development

```bash
# Node 20+ recommended
npm install
npm run dev
# Open http://localhost:3000
npm run build
npm start
```

## 🧪 Quick Test
Drag a PDF onto the upload box or paste resume text.

Click Analyze.

You should see:

Top 3–6 Job Recommendations (with Fit Score + rationale)

Subscores: Salary, WLB, Growth, Skill Match

Future Path: a 6–18 month staged plan with skill deltas and milestones

## 🧵 API

POST /api/analyze

Content-Type: multipart/form-data (file) or application/json (raw text)

Body:

file: PDF (optional)

text: string (optional—used if no file)

targetRoles: string[] (optional; biases recommendations)

### Response (shape example)

``` bash
{
  "summary": "Mid-level profile with strong support background...",
  "recommendations": [
    {
      "role": "Assistant Systems Administrator",
      "fitScore": 82,
      "subscores": { "salary": 70, "growth": 85, "wlb": 80, "match": 90 },
      "why": [
        "Your scripting and ticketing experience maps well...",
        "Clear path to AD/GPO competence."
      ],
      "salaryBand": "AUD $70k–$90k",
      "topGaps": ["GPO management", "Backup strategy"]
    }
  ],
  "futurePath": { "path": [] }
}
```
### Errors

``` bash
{ "error": "File too large" }
{ "error": "Unsupported file type" }
{ "error": "No input provided" }
```

## 🧮 Scoring Rubric (0–100)

The composite Fit Score is a weighted sum of normalized subscores:

Dimension	Weight
Salary Potential	35%
Career Growth/Demand	25%
Work–Life Balance	20%
Skill Match	20%

``` bash
export type Subscores = {
  salary: number;  // 0..100
  growth: number;  // 0..100
  wlb: number;     // 0..100
  match: number;   // 0..100
};

const WEIGHTS = { salary: 0.35, growth: 0.25, wlb: 0.20, match: 0.20 };

export function compositeScore(s: Subscores) {
  return Math.round(
    s.salary * WEIGHTS.salary +
    s.growth * WEIGHTS.growth +
    s.wlb    * WEIGHTS.wlb +
    s.match  * WEIGHTS.match
  );
}
```

## 🔮 Future Path (Career Ladder)
### Example JSON shape:
``` bash
{
  "path": [
    {
      "stage": "0–3 months",
      "target_role": "Assistant Systems Administrator",
      "focus_skills": ["Windows Server basics", "Ticket triage", "Scripting fundamentals"],
      "actions": ["Complete 2 lab projects", "Automate 1 recurring task at work"],
      "evidence": ["GitHub repo", "Runbook entry", "Before/after metrics"]
    },
    {
      "stage": "3–9 months",
      "target_role": "Systems Administrator",
      "focus_skills": ["AD/GPO", "Backups & DR", "Monitoring & alerting"],
      "actions": ["Implement backup rotation", "Add health checks"],
      "evidence": ["Diagrams", "Change log", "Post-incident review"]
    }
  ]
}
```

## 🛡️ Privacy

Default: No resume text or PDFs are stored.

Logs should minimize or redact PII.

If uploads are enabled, store in a private bucket with short retention.

## 🧰 Developer Notes

Drag & drop: <Dropzone /> accepts PDF and plaintext, debounces analysis, and shows size/type errors.

Parsing: Prefer server-side PDF parsing to keep client bundles small.

Providers: Wrap LLM calls in src/lib/llm.ts so you can switch models easily.

Determinism: Keep temperature low for stable scoring.

Accessibility: Use semantic HTML, focus management, and ARIA for progress/results.

## ✅ Quality Checklist
 No secrets in Git history (.env* ignored)

 Server-side file size/type validation

 Clear error states in UI (empty input, bad file, provider down)

 Keyboard + screen reader tested

 Basic rate limiting on /api/analyze

 Unit tests for scoring + parsers

 ## 🧪 Testing
``` bash
# Lint & typecheck
npm run lint
npm run typecheck

# Unit tests (vitest or jest)
npm run test

# E2E (Playwright)
npm run test:e2e
```
 ## 📦 Deployment

 Vercel (Next.js native) or Docker to your platform of choice.

Recreate your local environment variables in the hosting platform.

``` bash
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```