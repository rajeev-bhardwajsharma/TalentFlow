import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { type Candidate } from "../services/seed/candidateSeed";
import Button from "../components/ui/Button";
import { toast } from "react-hot-toast";

const Candidates: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const navigate = useNavigate();

  const stages = [
    { value: "all", label: "All Stages", color: "slate" },
    { value: "applied", label: "Applied", color: "blue" },
    { value: "screening", label: "Screening", color: "yellow" },
    { value: "interview", label: "Interview", color: "purple" },
    { value: "offer", label: "Offer", color: "green" },
    { value: "hired", label: "Hired", color: "emerald" },
    { value: "rejected", label: "Rejected", color: "red" },
  ];

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(stageFilter !== "all" && { stage: stageFilter }),
      });

      const response = await axios.get(`/candidates?${params}`);
      setCandidates(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [searchTerm, stageFilter]);

  const handleViewCandidate = (candidateId: string) => {
    navigate(`/dashboard/candidates/${candidateId}`);
  };

  const handleDeleteCandidate = async (candidateId: string) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) {
      return;
    }

    try {
      await axios.delete(`/candidates/${candidateId}`);
      toast.success("Candidate deleted successfully");
      fetchCandidates();
    } catch (error) {
      console.error("Error deleting candidate:", error);
      toast.error("Failed to delete candidate");
    }
  };

  const getStageColor = (stage: string) => {
    const stageColors: Record<string, string> = {
      applied: "bg-blue-100 text-blue-800",
      screening: "bg-yellow-100 text-yellow-800",
      interview: "bg-purple-100 text-purple-800",
      offer: "bg-green-100 text-green-800",
      hired: "bg-emerald-100 text-emerald-800",
      rejected: "bg-red-100 text-red-800",
    };
    return stageColors[stage] || "bg-slate-100 text-slate-800";
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Candidates
              </h1>
              <p className="text-slate-600">
                {candidates.length}{" "}
                {candidates.length === 1 ? "candidate" : "candidates"} found
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-modern pl-12"
              />
            </div>

            {/* Stage Filter */}
            <div className="flex flex-wrap gap-2">
              {stages.map((stage) => (
                <button
                  key={stage.value}
                  onClick={() => setStageFilter(stage.value)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    stageFilter === stage.value
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {stage.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Candidates Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 animate-pulse"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-2xl"></div>
                  <div className="flex-grow space-y-2">
                    <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded w-4/5"></div>
                </div>
              </div>
            ))}
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              No candidates found
            </h3>
            <p className="text-slate-600">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <span className="text-white font-bold text-xl">
                        {candidate.name.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-slate-900 text-lg mb-1 truncate">
                        {candidate.name}
                      </h3>
                      <p className="text-sm text-slate-600 truncate mb-2">
                        {candidate.email}
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStageColor(
                          candidate.stage
                        )}`}
                      >
                        {candidate.stage.charAt(0).toUpperCase() +
                          candidate.stage.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Job Title if available */}
                  {candidate.jobId && (
                    <div className="mb-3 flex items-center gap-2 text-sm text-slate-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="truncate">Applied to: {candidate.jobId}</span>
                    </div>
                  )}

                  {/* Skills */}
                  {candidate.skills && candidate.skills.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="badge badge-primary text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 3 && (
                          <span className="text-xs text-indigo-600 font-semibold">
                            +{candidate.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Applied Date */}
                  <div className="text-xs text-slate-500 mb-4">
                    Applied: {formatDate(candidate.appliedAt)}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewCandidate(candidate.id)}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View
                    </button>

                    <button
                      onClick={() => navigate(`/dashboard/candidates/${candidate.id}`)}
                      className="px-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors duration-200"
                      title="Edit Candidate"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleDeleteCandidate(candidate.id)}
                      className="px-4 py-2 border-2 border-red-500 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors duration-200"
                      title="Delete Candidate"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Candidates;
