import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

const AssessmentResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-indigo-600"
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
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Assessment Results
          </h1>
          <p className="text-slate-600 mb-6">
            No submissions yet for this assessment. Results will appear here once
            candidates complete the assessment.
          </p>
          <div className="text-left max-w-md mx-auto space-y-2 text-sm text-slate-600">
            <p>• Total Submissions: 0</p>
            <p>• Average Score: N/A</p>
            <p>• Completion Rate: N/A</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;
