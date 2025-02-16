import { useState } from 'react';
import ResumeInput from './components/ResumeInput';
import { FaRocket, FaBriefcase, FaLightbulb } from 'react-icons/fa';

function App() {
  const [analysis, setAnalysis] = useState<string>("");

  // Function to parse and format AI output
  const formatAnalysis = (rawText: string): JSX.Element[] => {
    if (!rawText) return [];

    const jobs = rawText.split("###").filter((job) => job.trim() !== "");
    return jobs.map((job: string, index: number) => {
      const lines = job.split("\n").filter((line) => line.trim() !== "");
      const title = lines[0]?.replace("Job Option", "").trim() || `Job ${index + 1}`;
      const jobTitle = lines.find(line => line.startsWith("**Job Title:**"))?.replace("**Job Title:**", "").trim();
      const score = lines.find(line => line.startsWith("**Future Potential Score:**"))?.replace("**Future Potential Score:**", "").trim();
      const explanation = lines.find(line => line.startsWith("**Explanation:**"))?.replace("**Explanation:**", "").trim();
      const summary = lines.find(line => line.startsWith("**Summary:**"))?.replace("**Summary:**", "").trim();

      return (
        <div key={index} className="mb-6 p-5 bg-white shadow-lg rounded-xl border border-gray-300 hover:scale-[1.02] transition-all duration-300">
          <h3 className="text-2xl font-bold text-indigo-800 mb-3 flex items-center">
            <FaBriefcase className="mr-3 text-indigo-600" /> {title}
          </h3>
          <p className="mb-2 text-lg"><strong>🛠️ Job Title:</strong> <span className="italic">{jobTitle}</span></p>
          <p className="mb-2 text-lg"><strong>⭐ Future Potential Score:</strong> <span className="text-indigo-700 font-semibold">{score}/10</span></p>
          <p className="mb-2 text-lg"><strong>💡 Explanation:</strong> <em>{explanation}</em></p>
          <p className="mb-2 text-lg"><strong>📖 Summary:</strong> {summary}</p>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-bl from-[#dbeafe] to-[#f0f2f5] flex items-center justify-center px-6 py-12">
      <div className="max-w-3xl w-full z-10">
        {/* Hero Section */}
        <div className="flex flex-col items-center mb-12">
          <FaRocket className="text-indigo-700 text-6xl mb-3 drop-shadow-md animate-bounce" />
          <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight drop-shadow-lg mb-4">
            AI Resume Analyzer
          </h1>
          <p className="text-lg text-gray-600">Uncover your career potential with AI-powered insights.</p>
        </div>

        {/* Resume Input Component */}
        <ResumeInput onAnalyze={setAnalysis} />

        {/* AI Analysis Output */}
        {analysis && (
          <div className="mt-6">
            <h2 className="text-3xl font-bold mb-4 text-indigo-900 flex items-center">
              <FaLightbulb className="mr-3 text-yellow-500" /> AI Analysis
            </h2>
            {formatAnalysis(analysis)}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
