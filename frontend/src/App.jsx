import React, { useState } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, Filter, CheckCircle2 } from 'lucide-react';

// Mock data updated
const MOCK_PROJECTS = [
  {
    _id: "1",
    title: "AI Legal Contract Risk Analyzer",
    domain: "LegalTech",
    problemStatement: "Legal teams spend hundreds of hours manually verifying contract compliance against updated regional privacy laws.",
    coreFeatures: [
      "Automated PDF Clause Parsing",
      "Real-time Compliance Risk Scoring",
      "Interactive High-Risk Highlight Dashboard",
      "Exportable Audit Summaries for Legal Teams"
    ]
  },
  {
    _id: "2",
    title: "Deep Space Galaxy Classifier",
    domain: "Astronomy",
    problemStatement: "Astronomical surveys produce raw telescope image streams faster than research staff can visually identify morphology.",
    coreFeatures: [
      "Galaxy Morphological Auto-Sorting",
      "Visual Confidence Heatmap Generator",
      "Batch Image Export API for Researchers",
      "Custom Fine-Tuned Model Weights Loader"
    ]
  }
];

export default function App() {
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <header className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-amber-400" />
            <h1 className="text-3xl font-extrabold tracking-tight">Project Ideas Generator</h1>
          </div>
          <p className="text-slate-400">Generates project ideas for different domains from live industry news.</p>
        </header>

        {/* FILTERS BAR */}
        <section className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <Filter className="w-5 h-5 text-amber-400" />
            <span className="font-medium text-sm">Domain Filter:</span>
          </div>

          <div>
            <select
              value={selectedDomain}
              onChange={(e) => { setSelectedDomain(e.target.value); setCurrentPage(1); }}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg p-2.5 focus:border-amber-400 focus:outline-none"
            >
              <option value="business">Business</option>
              <option value="crime">Crime</option>
              <option value="culture">Culture</option>
              <option value="education">Education</option>
              <option value="entertainment">Entertainment</option>
              <option value="environment">Environment</option>
              <option value="health">Health</option>
              <option value="politics">Politics</option>
              <option value="science">Science</option>
              <option value="sports">Sports</option>
              <option value="technology">Technology</option>
              <option value="weather">Weather</option>
            </select>
          </div>
        </section>

        {/* CARDS GRID */}
        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_PROJECTS.map((item) => (
            <div key={item._id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 transition space-y-4">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded-md">
                    {item.domain}
                  </span>
                </div>

                <h2 className="text-xl font-bold mb-3 text-slate-100">{item.title}</h2>
                <p className="text-sm text-slate-300 mb-4">{item.problemStatement}</p>

                {/* CORE FEATURES LIST (COUNT: 4) */}
                <div className="pt-3 border-t border-slate-800/80">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Core Features
                  </h3>
                  <ul className="space-y-1.5">
                    {item.coreFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
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