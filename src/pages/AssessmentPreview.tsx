import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { type Assessment } from "../services/seed/assessmentsSeed";
import Button from "../components/ui/Button";
import { toast } from "react-hot-toast";

const AssessmentPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessment();
  }, [id]);

  const fetchAssessment = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/assessments/${id}`);
      setAssessment(response.data);
    } catch (error) {
      console.error("Error fetching assessment:", error);
      toast.error("Failed to load assessment");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Assessment not found
          </h2>
          <Button onClick={() => navigate("/dashboard/assessments")}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard/assessments")}
          className="mb-6"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          }
        >
          Back
        </Button>

        {/* Assessment Info */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            {assessment.title}
          </h1>
          <p className="text-slate-600 mb-4">{assessment.description}</p>
          <div className="flex gap-4 text-sm text-slate-600">
            <span className="badge badge-primary">
              {assessment.sections.length} Sections
            </span>
            <span className="badge badge-info">
              {assessment.sections.reduce(
                (total, section) => total + section.questions.length,
                0
              )}{" "}
              Questions
            </span>
          </div>
        </div>

        {/* Sections */}
        {assessment.sections.map((section, sectionIndex) => (
          <div
            key={section.id}
            className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {sectionIndex + 1}. {section.title}
            </h2>

            <div className="space-y-6">
              {section.questions.map((question, questionIndex) => (
                <div key={question.id} className="border-b border-slate-200 pb-6 last:border-b-0">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-slate-500 font-medium">
                      {questionIndex + 1}.
                    </span>
                    <div className="flex-grow">
                      <p className="text-slate-900 font-medium mb-2">
                        {question.question}
                        {question.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </p>
                      <span className="badge badge-primary text-xs">
                        {question.type}
                      </span>
                    </div>
                  </div>

                  {/* Options preview */}
                  {question.options && question.options.length > 0 && (
                    <div className="ml-8 space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <input
                            type={
                              question.type === "multi-choice"
                                ? "checkbox"
                                : "radio"
                            }
                            disabled
                            className="w-4 h-4"
                          />
                          <span className="text-slate-700">{option}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Text input preview */}
                  {(question.type === "short-text" || question.type === "long-text") && (
                    <div className="ml-8">
                      <input
                        type="text"
                        disabled
                        placeholder="Answer will be entered here..."
                        className="input-modern"
                      />
                    </div>
                  )}

                  {/* Numeric input preview */}
                  {question.type === "numeric" && (
                    <div className="ml-8">
                      <input
                        type="number"
                        disabled
                        placeholder="Enter number..."
                        className="input-modern"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentPreview;
