// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';

export default function App() {
  const [ideas, setIdeas] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const DOMAINS = [
    'business', 'crime', 'culture', 'education', 
    'entertainment', 'environment', 'health', 'politics', 
    'science', 'sports', 'technology', 'weather'
  ];

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/problems?domain=${selectedDomain}&page=${currentPage}&limit=6`
        );
        const result = await response.json();
        
        if (result.success) {
          setIdeas(result.data);
          setTotalPages(result.pagination.pages);
        }
      } catch (error) {
        console.error('Error fetching ideas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, [selectedDomain, currentPage]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 p-8">
      {/* Header Section */}
      <header className="max-w-7xl mx-auto mb-10 border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-400">
            Project Idea Discovery
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Transforming real-world news into structured software portfolio projects
          </p>
        </div>

        {/* Domain Filter Dropdown */}
        <select
          value={selectedDomain}
          onChange={(e) => {
            setSelectedDomain(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-4 py-2 focus:border-amber-400 focus:outline-none capitalize cursor-pointer self-start md:self-auto"
        >
          <option value="All">All Domains</option>
          {DOMAINS.map((domain) => (
            <option key={domain} value={domain}>
              {domain}
            </option>
          ))}
        </select>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20 text-slate-400 font-medium">
            Loading project briefs...
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-20 text-slate-400 font-medium">
            No projects found for this domain.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <div
                key={idea._id}
                className="bg-slate-800/80 border border-slate-700/70 rounded-xl p-6 flex flex-col justify-between shadow-lg hover:border-slate-600 transition-all"
              >
                <div>
                  {/* Category Badge */}
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md mb-3">
                    {idea.domain}
                  </span>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-white mb-3 leading-snug">
                    {idea.title}
                  </h2>

                  <hr className="border-slate-700/60 my-3" />

                  {/* Problem Statement */}
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    {idea.problemStatement}
                  </p>

                  <hr className="border-slate-700/60 my-4" />

                  {/* Core Features Section */}
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Core Features:
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {idea.coreFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12 border-t border-slate-800 pt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <span className="text-sm text-slate-400 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}