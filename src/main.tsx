import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { initializeJobs } from "./services/db/jobsDb";
import { initializeCandidates } from "./services/db/candidatesDb";
import { initializeAssessments } from "./services/db/assessmentsDb";
import { Toaster } from "react-hot-toast";

const startApp = () => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#fff",
              color: "#334155",
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
              padding: "16px",
              fontSize: "14px",
              fontWeight: "500",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </BrowserRouter>
    </StrictMode>
  );
};

if (process.env.NODE_ENV === "development") {
  import("./services/mocks/browser")
    .then(({ worker }) => {
      worker
        .start({
          onUnhandledRequest: "warn",
        })
        .then(() => {
          initializeJobs();
          initializeCandidates();
          initializeAssessments();
          startApp();
        });
    })
    .catch(console.error);
} else {
  startApp();
}
