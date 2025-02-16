import React, { useState } from 'react';
import axios from 'axios';
import { FaFileAlt, FaRocket, FaUpload } from 'react-icons/fa';

const ResumeInput = ({ onAnalyze }) => {
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  // Handle text change
  const handleTextChange = (e) => setResumeText(e.target.value);

  // Handle file drop
  const handleDrop = async (event) => {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      const formData = new FormData();
      formData.append("pdf", file);

      try {
        const response = await axios.post("http://localhost:5000/upload-pdf", formData);
        setResumeText(response.data.text);
      } catch (error) {
        console.error("Failed to parse PDF:", error);
        alert("Failed to parse PDF. Please try again.");
      }
    } else {
      alert("Please drop a valid PDF file.");
    }
  };

  // Handle drag events
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  // Submit resume
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      alert("Please enter or upload a resume before analyzing.");
      return;
    }

    setLoading(true);


    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `Analyze the provided resume and suggest 5 relevant job options. For each job, respond in the following markdown format:

              ### Job Option X: [Job Title]
              **Job Title:** [Title]  
              **Future Potential Score:** [Rating 1-10]  
              **Explanation:** Write this section in the second person (e.g., "You have strong skills in...") and exclude any numbers.  
              **Summary:** Conclude with a direct statement about why the role suits the person, again in the second person.

              Use clear, concise language with no numbered lists. Focus on salary potential, work-life balance, job growth, industry stability, and skill transferability.`
            },
            { role: "user", content: resumeText }
          ],
          max_tokens: 1200,
          temperature: 0.7,
        },
        {
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}A`,
            "OpenAI-Project": "proj_XqW8dZdPbjiegvpKIDJwoSsR"
          },
        }
      );
  
      onAnalyze(response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      onAnalyze("⚠️ An error occurred while analyzing the resume. Please try again.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-6 border border-gray-300">
      <h2 className="text-2xl font-medium text-gray-900 mb-4 flex items-center">
        <FaFileAlt className="text-indigo-700 mr-3" /> Paste or Drag and Drop Your Resume Below:
      </h2>

      {/* Textarea Input with Drag-and-Drop */}
      <div
        className={`w-full h-48 p-4 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-4 focus:ring-indigo-500 shadow-inner resize-none placeholder-gray-400 transition-all duration-300 ${
          dragging ? "bg-blue-100" : ""
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <textarea
          className="w-full h-full resize-none focus:outline-none"
          placeholder="Paste your resume here or drag & drop a PDF..."
          value={resumeText}
          onChange={handleTextChange}
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl w-full shadow-lg hover:scale-105 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center"
        disabled={loading}
      >
        {loading ? (
          <span className="animate-pulse">⏳ Analyzing...</span>
        ) : (
          <>
            <FaRocket className="mr-2" /> Analyze Resume
          </>
        )}
      </button>
    </form>
  );
};

export default ResumeInput;