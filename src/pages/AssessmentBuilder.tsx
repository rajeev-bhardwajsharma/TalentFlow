import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { type Assessment, type Question } from "../services/seed/assessmentsSeed";
import { type Job } from "../services/seed/jobsSeed";
import Button from "../components/ui/Button";
import { toast } from "react-hot-toast";

const AssessmentBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [jobs, setJobs] = useState<Job[]>([]);
  const [formData, setFormData] = useState({
    jobId: "",
    title: "",
    description: "",
  });
  const [sections, setSections] = useState<
    Array<{
      id: string;
      title: string;
      questions: Question[];
    }>
  >([
    {
      id: `section-${Date.now()}`,
      title: "",
      questions: [],
    },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
    if (isEditMode) {
      fetchAssessment();
    }
  }, [id]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("/jobs");
      setJobs(response.data.data || response.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
    }
  };

  const fetchAssessment = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`/assessments/${id}`);
      const assessment = response.data;
      
      if (assessment) {
        setFormData({
          jobId: assessment.jobId || "",
          title: assessment.title || "",
          description: assessment.description || "",
        });
        setSections(assessment.sections || [
          {
            id: `section-${Date.now()}`,
            title: "",
            questions: [],
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching assessment:", error);
      toast.error("Assessment not found");
      navigate("/dashboard/assessments");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchJobs();
    if (isEditMode && id) {
      fetchAssessment();
    }
  }, [id, isEditMode]);
  

  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        id: `section-${Date.now()}`,
        title: "",
        questions: [],
      },
    ]);
  };

  const handleRemoveSection = (sectionIndex: number) => {
    setSections(sections.filter((_, index) => index !== sectionIndex));
  };

  const handleAddQuestion = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions.push({
      id: `q-${sectionIndex}-${newSections[sectionIndex].questions.length}`,
      type: "single-choice",
      question: "",
      options: ["", ""],
      required: true,
    });
    setSections(newSections);
  };

  const handleRemoveQuestion = (sectionIndex: number, questionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions = newSections[
      sectionIndex
    ].questions.filter((_, index) => index !== questionIndex);
    setSections(newSections);
  };

  const handleSectionTitleChange = (sectionIndex: number, value: string) => {
    const newSections = [...sections];
    newSections[sectionIndex].title = value;
    setSections(newSections);
  };

  const handleQuestionChange = (
    sectionIndex: number,
    questionIndex: number,
    field: keyof Question,
    value: any
  ) => {
    const newSections = [...sections];
    (newSections[sectionIndex].questions[questionIndex] as any)[field] = value;
    setSections(newSections);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.jobId || !formData.title) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const assessmentData: Omit<Assessment, "id" | "createdAt"> = {
        jobId: formData.jobId,
        title: formData.title,
        description: formData.description,
        sections: sections.filter((s) => s.title && s.questions.length > 0),
      };

      if (isEditMode) {
        await axios.put(`/assessments/${id}`, {
          ...assessmentData,
          id,
          createdAt: new Date(),
        });
        toast.success("Assessment updated successfully!");
      } else {
        await axios.post("/assessments", {
          ...assessmentData,
          id: `assessment-${Date.now()}`,
          createdAt: new Date(),
        });
        toast.success("Assessment created successfully!");
      }
      navigate("/dashboard/assessments");
    } catch (error) {
      console.error("Error saving assessment:", error);
      toast.error("Failed to save assessment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/assessments")}
            className="mb-4"
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
            Back to Assessments
          </Button>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {isEditMode ? "Edit Assessment" : "Create New Assessment"}
          </h1>
          <p className="text-slate-600">
            Build a custom assessment for your job position
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Basic Information
            </h2>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Select Job <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.jobId}
                onChange={(e) =>
                  setFormData({ ...formData, jobId: e.target.value })
                }
                className="input-modern"
                required
              >
                <option value="">Select a job...</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Assessment Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="input-modern"
                placeholder="e.g., Frontend Developer Assessment"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input-modern resize-none"
                rows={3}
                placeholder="Brief description of this assessment..."
              />
            </div>
          </div>

          {/* Sections */}
          {sections.map((section, sectionIndex) => (
            <div
              key={section.id}
              className="bg-white rounded-2xl shadow-lg p-6 space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">
                  Section {sectionIndex + 1}
                </h2>
                {sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(sectionIndex)}
                    className="text-red-600 hover:text-red-700 font-semibold"
                  >
                    Remove Section
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) =>
                    handleSectionTitleChange(sectionIndex, e.target.value)
                  }
                  className="input-modern"
                  placeholder="e.g., Technical Skills"
                />
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {section.questions.map((question, questionIndex) => (
                  <div
                    key={question.id}
                    className="bg-slate-50 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-900">
                        Question {questionIndex + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveQuestion(sectionIndex, questionIndex)
                        }
                        className="text-red-600 hover:text-red-700 text-sm font-semibold"
                      >
                        Remove
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Question Type
                      </label>
                      <select
                        value={question.type}
                        onChange={(e) =>
                          handleQuestionChange(
                            sectionIndex,
                            questionIndex,
                            "type",
                            e.target.value
                          )
                        }
                        className="input-modern"
                      >
                        <option value="single-choice">Single Choice</option>
                        <option value="multi-choice">Multiple Choice</option>
                        <option value="short-text">Short Text</option>
                        <option value="long-text">Long Text</option>
                        <option value="numeric">Numeric</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Question Text
                      </label>
                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) =>
                          handleQuestionChange(
                            sectionIndex,
                            questionIndex,
                            "question",
                            e.target.value
                          )
                        }
                        className="input-modern"
                        placeholder="Enter your question..."
                      />
                    </div>

                    {(question.type === "single-choice" ||
                      question.type === "multi-choice") && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Options (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={question.options?.join(", ") || ""}
                          onChange={(e) =>
                            handleQuestionChange(
                              sectionIndex,
                              questionIndex,
                              "options",
                              e.target.value.split(",").map((o) => o.trim())
                            )
                          }
                          className="input-modern"
                          placeholder="Option 1, Option 2, Option 3"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={question.required}
                        onChange={(e) =>
                          handleQuestionChange(
                            sectionIndex,
                            questionIndex,
                            "required",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <label className="text-sm font-medium text-slate-700">
                        Required question
                      </label>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddQuestion(sectionIndex)}
                  className="w-full"
                >
                  + Add Question
                </Button>
              </div>
            </div>
          ))}

          {/* Add Section Button */}
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddSection}
            className="w-full"
          >
            + Add Section
          </Button>

          {/* Submit Buttons */}
          <div className="flex gap-4 sticky bottom-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/assessments")}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
              className="flex-1"
            >
              {isEditMode ? "Update Assessment" : "Create Assessment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssessmentBuilder;
