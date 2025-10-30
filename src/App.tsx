import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import HrDashboard from "./pages/HrDashboard";
import Candidates from "./pages/Candidates";
import Jobs from "./pages/Jobs";
import CandidateJobs from "./pages/CandidateJobs";
import JobDetails from "./pages/JobDetails";
import Assessments from "./pages/Assessments";
import AssessmentBuilder from "./pages/AssessmentBuilder";
import AssessmentPreview from "./pages/AssessmentPreview";
import AssessmentResults from "./pages/AssessmentResults";
import CandidateProfile from "./pages/CandidateProfile";

// Layouts
import HrLayout from "./components/layout/HrLayout";

function App() {
  return (
    <UserProvider>
      <Routes>
        {/* Public Routes - NO Layout wrapper */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Candidate Public Routes */}
        <Route path="/jobs" element={<CandidateJobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        {/* HR Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["hr"]}>
              <HrLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HrDashboard />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="candidates/:id" element={<CandidateProfile />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="assessments/new" element={<AssessmentBuilder />} />
          <Route path="assessments/:id/edit" element={<AssessmentBuilder />} />
          <Route path="assessments/:id/preview" element={<AssessmentPreview />} />
          <Route path="assessments/:id/results" element={<AssessmentResults />} />
        </Route>

        {/* Catch all - redirect based on role or to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
