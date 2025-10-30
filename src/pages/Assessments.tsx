import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { type Assessment } from "../services/seed/assessmentsSeed";
import { type Job } from "../services/seed/jobsSeed";
import Button from "../components/ui/Button";
import { toast } from "react-hot-toast";

const Assessments: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assessmentsRes, jobsRes] = await Promise.all([
        axios.get("/assessments"),
        axios.get("/jobs"),
      ]);

      setAssessments(assessmentsRes.data.data || assessmentsRes.data || []);
      setJobs(jobsRes.data.data || jobsRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load assessments");
    } finally {
      setLoading(false);
    }
  };

  const getJobById = (jobId: string) => {
    return jobs.find((job) => job.id === jobId);
  };

  const handleEdit = (assessmentId: string) => {
    navigate(`/dashboard/assessments/${assessmentId}/edit`);
  };

  const handlePreview = (assessmentId: string) => {
    navigate(`/dashboard/assessments/${assessmentId}/preview`);
  };

  const handleResults = (assessmentId: string) => {
    navigate(`/dashboard/assessments/${assessmentId}/results`);
  };

  const handleDelete = async (assessmentId: string) => {
    if (!window.confirm("Are you sure you want to delete this assessment?")) {
      return;
    }

    try {
      await axios.delete(`/assessments/${assessmentId}`);
      toast.success("Assessment deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting assessment:", error);
      toast.error("Failed to delete assessment");
    }
  };

  const handleCreateNew = () => {
    navigate("/dashboard/assessments/new");
  };

  const getTotalQuestions = (assessment: Assessment) => {
    return assessment.sections.reduce(
      (total, section) => total + section.questions.length,
      0
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Assessments
              </h1>
              <p className="text-slate-600">
                Create and manage candidate assessments
              </p>
            </div>
            <Button
              variant="primary"
              onClick={handleCreateNew}
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              }
            >
              Create Assessment
            </Button>
          </div>
        </div>

        {/* Assessments List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 animate-pulse"
              >
                <div className="space-y-4">
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="flex gap-2">
                    <div className="h-10 bg-slate-200 rounded flex-1"></div>
                    <div className="h-10 bg-slate-200 rounded flex-1"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : assessments.length === 0 ? (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              No assessments yet
            </h3>
            <p className="text-slate-600 mb-6">
              Get started by creating your first assessment
            </p>
            <Button variant="primary" onClick={handleCreateNew}>
              Create Assessment
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((assessment) => {
              const job = getJobById(assessment.jobId);
              const totalQuestions = getTotalQuestions(assessment);

              return (
                <div
                  key={assessment.id}
                  className="bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 overflow-hidden group"
                >
                  {/* Header with Job Info */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                      {assessment.title}
                    </h3>
                    {job && (
                      <div className="flex items-center gap-2 text-indigo-100 text-sm">
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
                        <span className="truncate">{job.title}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Description */}
                    <p className="text-slate-600 text-sm line-clamp-3">
                      {assessment.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <svg
                          className="w-5 h-5 text-indigo-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="font-semibold">
                          {assessment.sections.length} section
                          {assessment.sections.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <svg
                          className="w-5 h-5 text-purple-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-semibold">
                          {totalQuestions} question
                          {totalQuestions !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Job Details */}
                    {job && (
                      <div className="flex flex-wrap gap-2">
                        <span className="badge badge-primary text-xs">
                          {job.jobType}
                        </span>
                        <span className="badge badge-info text-xs">
                          {job.location}
                        </span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => handleEdit(assessment.id)}
                        className="px-3 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
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
                        Edit
                      </button>

                      <button
                        onClick={() => handlePreview(assessment.id)}
                        className="px-3 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-50 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
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
                        Preview
                      </button>

                      <button
                        onClick={() => handleResults(assessment.id)}
                        className="px-3 py-2 text-sm font-semibold text-green-600 hover:bg-green-50 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
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
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        Results
                      </button>

                      <button
                        onClick={() => handleDelete(assessment.id)}
                        className="px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
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
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessments;
