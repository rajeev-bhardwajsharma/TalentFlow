import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Button from "../components/ui/Button";
import Logo from "../components/ui/Logo";
import { toast } from "react-hot-toast";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setRole } = useUser();

  const handleLogin = (role: "hr" | "candidate") => {
    setRole(role);
    toast.success(
      `Welcome ${role === "hr" ? "HR Manager" : "Job Seeker"}!`
    );
    
    if (role === "hr") {
      navigate("/dashboard");
    } else {
      navigate("/jobs");
    }
  };

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Login Container */}
      <div className="relative w-full max-w-5xl">
        {/* Logo at Top */}
        <div className="flex justify-center mb-8 animate-slide-up">
          <Logo size="lg" />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Welcome to <span className="text-gradient">TalentFlow</span>
              </h1>
              <p className="text-xl text-slate-600">
                Choose how you'd like to continue
              </p>
            </div>

            {/* Role Selection Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* HR Login Card */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <svg
                      className="w-10 h-10 text-white"
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
                  </div>

                  {/* Content */}
                  <h2 className="text-2xl font-bold text-slate-900 mb-3 text-center">
                    HR Manager
                  </h2>
                  <p className="text-slate-600 mb-6 text-center">
                    Manage jobs, candidates, and assessments
                  </p>

                  {/* Features List */}
                  <ul className="space-y-3 mb-6">
                    {[
                      "Create & manage job postings",
                      "Review candidate applications",
                      "Build custom assessments",
                      "Track hiring pipeline",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-sm text-slate-700">
                        <svg
                          className="w-5 h-5 text-indigo-600 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => handleLogin("hr")}
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
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    }
                  >
                    Continue as HR
                  </Button>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Candidate Login Card */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl p-8 border-2 border-pink-100 hover:border-pink-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>

                  {/* Content */}
                  <h2 className="text-2xl font-bold text-slate-900 mb-3 text-center">
                    Job Seeker
                  </h2>
                  <p className="text-slate-600 mb-6 text-center">
                    Browse jobs and apply to opportunities
                  </p>

                  {/* Features List */}
                  <ul className="space-y-3 mb-6">
                    {[
                      "Browse available positions",
                      "Apply to multiple jobs",
                      "Complete assessments",
                      "Track application status",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-sm text-slate-700">
                        <svg
                          className="w-5 h-5 text-pink-600 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => handleLogin("candidate")}
                    className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
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
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    }
                  >
                    Continue as Candidate
                  </Button>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-600/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Demo mode - No authentication required
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
