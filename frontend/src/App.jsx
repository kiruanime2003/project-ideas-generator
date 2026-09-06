import React, { useState } from 'react';
import { Sparkles, ExternalLink, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

// Mock data to preview UI layout before connecting DB
const MOCK_PROJECTS = [
  {
    _id: "1",
    title: "AI Legal Contract Risk Analyzer",
    domain: "LegalTech",
    techStack: ["Python", "FastAI", "Streamlit"],
    newsSourceTitle: "New Privacy Regulations Challenge Enterprise Compliance Teams",
    newsSourceUrl: "https://techcrunch.com",
    problemStatement: "Legal teams spend hundreds of hours manually verifying contract compliance against updated regional privacy laws.",
    keyFeatures: ["PDF Clause Parsing", "Automated Risk Scoring", "High-Risk Highlight Dashboard"]
  },
  {
    _id: "2",
    title: "Deep Space Galaxy Classifier",
    domain: "Astronomy",
    techStack: ["React", "FastAI", "PyTorch"],
    newsSourceTitle: "JWST Captures Millions of Uncategorized Deep Field Galaxies",
    newsSourceUrl: "https://news.ycombinator.com",
    problemStatement: "Astronomical surveys produce raw telescope image streams faster than research staff can visually identify morphology.",
    keyFeatures: ["Galaxy Morphological Sorting", "Confidence Map Visualizer", "Batch Export API"]
  }
];

export default function App() {
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [techFilter, setTechFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-mono">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <header className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-amber-400" />
            <h1 className="text-3xl font-extrabold tracking-tight">Project Ideas Generator</h1>
          </div>
          <p className="text-slate-400">Automated portfolio project ideas synthesized from live industry news.</p>
        </header>

        {/* FILTERS BAR */}
        <section className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 w-full md:w-auto">
            <Filter className="w-5 h-5 text-amber-400" />
            <span className="font-medium text-sm">Filters:</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <select
              value={selectedDomain}
              onChange={(e) => { setSelectedDomain(e.target.value); setCurrentPage(1); }}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg p-2.5 focus:border-amber-400 focus:outline-none"
            >
              <option value="All">All Domains</option>
              <option value="LegalTech">LegalTech</option>
              <option value="Astronomy">Astronomy</option>
              <option value="Healthcare">Healthcare</option>
            </select>

            <input
              type="text"
              placeholder="Filter by Tech Stack (e.g. FastAI)"
              value={techFilter}
              onChange={(e) => { setTechFilter(e.target.value); setCurrentPage(1); }}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg p-2.5 focus:border-amber-400 focus:outline-none w-full sm:w-64"
            />
          </div>
        </section>

        {/* CARDS GRID */}
        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_PROJECTS.map((item) => (
            <div key={item._id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded-md">
                    {item.domain}
                  </span>
                  <a
                    href={item.newsSourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                  >
                    Source <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <h2 className="text-xl font-bold mb-2 text-slate-100">{item.title}</h2>
                <p className="text-xs text-slate-500 mb-4 italic">"{item.newsSourceTitle}"</p>
                
                <p className="text-sm text-slate-300 mb-4">{item.problemStatement}</p>

                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Suggested Features</h4>
                  <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                    {item.keyFeatures.map((feat, i) => (
                      <li key={i}>{feat}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2">
                {item.techStack.map((tech) => (
                  <span key={tech} className="text-xs bg-slate-950 border border-slate-800 text-slate-400 px-2 py-1 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </main>

        {/* PAGINATION */}
        <footer className="flex items-center justify-between border-t border-slate-800 pt-6 text-sm text-slate-400">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <span>Page {currentPage} of 1</span>

          <button
            disabled={true}
            onClick={() => setCurrentPage(p => p + 1)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </footer>

      </div>
    </div>
  );
}