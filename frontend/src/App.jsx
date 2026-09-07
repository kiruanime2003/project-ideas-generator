// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';

const DOMAINS = [
  'all', 'business', 'crime', 'culture', 'education', 
  'entertainment', 'environment', 'health', 'politics', 
  'science', 'sports', 'technology', 'weather'
];

const RAW_API_URL = import.meta.env.VITE_API_URL || 'https://project-ideas-backend-w0r3.onrender.com';
const API_BASE_URL = RAW_API_URL.replace(/\/+$/, '');

const fetchIdeas = async () => {
  setLoading(true);
  try {
    // This now cleanly formats as: https://your-backend.onrender.com/api/problems
    const res = await fetch(
      `${API_BASE_URL}/api/problems?page=${page}&limit=6&domain=${selectedDomain}`
    );

    const contentType = res.headers.get("content-type");
    if (!res.ok || !contentType || !contentType.includes("application/json")) {
      const errorText = await res.text();
      console.error("Non-JSON API Response received:", errorText);
      setProjects([]);
      return;
    }

    const result = await res.json();
    if (result.success) {
      setProjects(result.data);
      setTotalPages(result.pagination?.totalPages || result.pagination?.pages || 1);
    }
  } catch (err) {
    console.error("Error fetching ideas:", err);
  } finally {
    setLoading(false);

  const handleDomainChange = (domain) => {
    setSelectedDomain(domain);
    setPage(1); // Reset to page 1 on category change
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          💥Project Ideas Generator
        </h1>

        {/* Domain Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {DOMAINS.map((domain) => (
            <button
              key={domain}
              onClick={() => handleDomainChange(domain)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition ${
                selectedDomain === domain
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">
            Loading fresh project ideas...
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No projects found for this domain filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div 
                key={project._id} 
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md uppercase tracking-wider">
                    {project.domain}
                  </span>
                  <h2 className="text-lg font-bold text-gray-900 mt-3 leading-snug">
                    {project.title}
                  </h2>
                  <p className="text-gray-600 text-sm mt-2">
                    {project.problemStatement}
                  </p>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Core Features
                    </h4>
                    <ul className="text-xs text-gray-700 space-y-1.5 list-disc list-inside">
                      {project.coreFeatures && project.coreFeatures.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-10 pt-4 border-t border-gray-200">
          <button
            disabled={page === 1 || loading}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <span className="text-sm font-medium text-gray-600">
            Page <span className="font-bold text-gray-900">{page}</span> of{' '}
            <span className="font-bold text-gray-900">{totalPages || 1}</span>
          </span>

          <button
            disabled={page >= totalPages || loading}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}