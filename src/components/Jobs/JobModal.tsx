import React, { useState } from "react";
import axios from "axios";
import { type Job } from "../../services/seed/jobsSeed";
import { toast } from "react-hot-toast";
import Button from "../ui/Button";

interface JobModalProps {
  job?: Job | null;
  onClose: () => void;
  onSave: () => void;
}

const JobModal: React.FC<JobModalProps> = ({ job, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: job?.title || "",
    location: job?.location || "",
    jobType: job?.jobType || ("Full-time" as "Full-time" | "Remote" | "Part-time" | "Contract"),
    salary: job?.salary || "",
    description: job?.description || "",
    requirements: job?.requirements.join("\n") || "",
    tags: job?.tags.join(", ") || "",
    status: job?.status || ("active" as "active" | "archived"),
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = async () => {
    const newErrors: Record<string, string> = {};
  
    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    }
  
    if (!formData.description.trim()) {
      newErrors.description = "Job description is required";
    }
  
    // Unique slug validation
    const slug = formData.title.toLowerCase().replace(/\s+/g, '-');
    if (!job) { // Only check on create, not edit
      try {
        const response = await axios.get('/jobs');
        const existingJob = response.data.data.find(
          (j: Job) => j.slug === slug
        );
        if (existingJob) {
          newErrors.title = "A job with this title already exists";
        }
      } catch (error) {
        console.error("Error checking slug uniqueness:", error);
      }
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix all errors");
      return;
    }

    setLoading(true);
    try {
      const jobData = {
        ...formData,
        requirements: formData.requirements.split("\n").filter((r) => r.trim()),
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
      };

      if (job) {
        await axios.patch(`/jobs/${job.id}`, jobData);
        toast.success("Job updated successfully!");
      } else {
        await axios.post("/jobs", jobData);
        toast.success("Job created successfully!");
      }
      onSave();
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Error saving job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="gradient-primary px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {job ? "Edit Job Position" : "Create New Job"}
              </h2>
              <p className="text-indigo-100">
                {job ? "Update job details below" : "Fill in the details to post a new job"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200 text-white"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Job Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className={`input-modern ${
                      errors.title ? "border-red-400" : ""
                    }`}
                    placeholder="e.g., Senior React Developer"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="input-modern"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Job Type
                  </label>
                  <select
                    value={formData.jobType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jobType: e.target.value as
                          | "Full-time"
                          | "Remote"
                          | "Part-time"
                          | "Contract",
                      })
                    }
                    className="input-modern"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData({ ...formData, salary: e.target.value })
                    }
                    className="input-modern"
                    placeholder="e.g., $80K - $120K"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "active" | "archived",
                      })
                    }
                    className="input-modern"
                  >
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="divider"></div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                Job Description
              </h3>

              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={5}
                className={`input-modern resize-none ${
                  errors.description ? "border-red-400" : ""
                }`}
                placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>

            {/* Requirements & Tags */}
            <div className="divider"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  Requirements
                </h3>
                <textarea
                  value={formData.requirements}
                  onChange={(e) =>
                    setFormData({ ...formData, requirements: e.target.value })
                  }
                  rows={8}
                  className="input-modern resize-none"
                  placeholder="3+ years of React experience&#10;Strong TypeScript skills&#10;Experience with testing frameworks"
                />
                <p className="text-xs text-slate-500 mt-2">
                  One requirement per line
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-cyan-100 text-cyan-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  Tags
                </h3>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="input-modern"
                  placeholder="React, TypeScript, Frontend, Remote"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Separate tags with commas
                </p>

                {/* Tag Preview */}
                {formData.tags && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs font-semibold text-slate-600 mb-2">
                      Preview:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter((tag) => tag)
                        .map((tag, index) => (
                          <span
                            key={index}
                            className="badge badge-primary"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
              <Button type="button" onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading}
              >
                {job ? "Update Job" : "Create Job"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobModal;
