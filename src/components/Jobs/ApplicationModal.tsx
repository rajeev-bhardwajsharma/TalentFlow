import React, { useState } from "react";
import axios from "axios";
import { type Job } from "../../services/seed/jobsSeed";
import { toast } from "react-hot-toast";
import Button from "../ui/Button";

interface ApplicationModalProps {
  job: Job;
  onClose: () => void;
  onSuccess: () => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  job,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    candidateName: "",
    candidateEmail: "",
    candidatePhone: "",
    coverLetter: "",
    experience: "",
    education: "",
    skills: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "candidateName":
        return value.trim() ? "" : "Name is required";
      case "candidateEmail":
        if (!value.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
        return "";
      case "candidatePhone":
        return value.trim() ? "" : "Phone number is required";
      case "coverLetter":
        return value.trim() ? "" : "Cover letter is required";
      default:
        return "";
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    const error = validateField(field, formData[field as keyof typeof formData]);
    setErrors({ ...errors, [field]: error });
  };

  const handleChange = (
    field: string,
    value: string
  ) => {
    setFormData({ ...formData, [field]: value });
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors({ ...errors, [field]: error });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    setLoading(true);
    try {
      const candidateData = {
        jobId: job.id,
        name: formData.candidateName,
        email: formData.candidateEmail,
        phone: formData.candidatePhone,
        resume: "",
        coverLetter: formData.coverLetter,
        experience: formData.experience,
        education: formData.education,
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        stage: "applied" as const,
      };

      await axios.post("/applications", candidateData);
      toast.success("Application submitted successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header with Gradient */}
        <div className="gradient-primary px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Apply for Position
              </h2>
              <p className="text-indigo-100 font-medium">{job.title}</p>
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
            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.candidateName}
                    onChange={(e) =>
                      handleChange("candidateName", e.target.value)
                    }
                    onBlur={() => handleBlur("candidateName")}
                    className={`input-modern ${
                      errors.candidateName && touched.candidateName
                        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                        : ""
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.candidateName && touched.candidateName && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.candidateName}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.candidateEmail}
                    onChange={(e) =>
                      handleChange("candidateEmail", e.target.value)
                    }
                    onBlur={() => handleBlur("candidateEmail")}
                    className={`input-modern ${
                      errors.candidateEmail && touched.candidateEmail
                        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                        : ""
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.candidateEmail && touched.candidateEmail && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.candidateEmail}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.candidatePhone}
                    onChange={(e) =>
                      handleChange("candidatePhone", e.target.value)
                    }
                    onBlur={() => handleBlur("candidatePhone")}
                    className={`input-modern ${
                      errors.candidatePhone && touched.candidatePhone
                        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                        : ""
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.candidatePhone && touched.candidatePhone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.candidatePhone}
                    </p>
                  )}
                </div>

                {/* Education Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Education
                  </label>
                  <input
                    type="text"
                    value={formData.education}
                    onChange={(e) =>
                      handleChange("education", e.target.value)
                    }
                    className="input-modern"
                    placeholder="Bachelor's in Computer Science"
                  />
                </div>
              </div>
            </div>

            {/* Professional Background Section */}
            <div className="divider"></div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Professional Background
              </h3>

              {/* Experience Field */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Professional Experience
                </label>
                <textarea
                  value={formData.experience}
                  onChange={(e) =>
                    handleChange("experience", e.target.value)
                  }
                  rows={3}
                  className="input-modern resize-none"
                  placeholder="Describe your relevant work experience..."
                />
              </div>

              {/* Skills Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) =>
                    handleChange("skills", e.target.value)
                  }
                  className="input-modern"
                  placeholder="React, TypeScript, Node.js, Python"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Separate skills with commas
                </p>
              </div>
            </div>

            {/* Cover Letter Section */}
            <div className="divider"></div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center text-sm font-bold">
                  3
                </span>
                Cover Letter
              </h3>
              <textarea
                value={formData.coverLetter}
                onChange={(e) =>
                  handleChange("coverLetter", e.target.value)
                }
                onBlur={() => handleBlur("coverLetter")}
                rows={5}
                className={`input-modern resize-none ${
                  errors.coverLetter && touched.coverLetter
                    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                    : ""
                }`}
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
              />
              {errors.coverLetter && touched.coverLetter && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.coverLetter}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading}
              >
                Submit Application
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;
