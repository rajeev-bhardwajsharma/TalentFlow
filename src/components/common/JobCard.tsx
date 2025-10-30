import React from "react";
import type { Job } from "../../services/seed/jobsSeed";
import Card from "../ui/Card";
import { useNavigate } from "react-router-dom";

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const navigate = useNavigate();

  const getTypeGradient = (type: string) => {
    switch (type) {
      case "Full-time":
        return "from-blue-500 to-cyan-500";
      case "Remote":
        return "from-purple-500 to-pink-500";
      case "Part-time":
        return "from-yellow-500 to-orange-500";
      case "Contract":
        return "from-green-500 to-emerald-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  const handleJobCardClick = () => {
    navigate(`/jobs/${job.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card hoverable onClick={handleJobCardClick} className="group animate-slide-up">
      <div className="flex items-start gap-4">
        {/* Gradient Avatar */}
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getTypeGradient(
            job.jobType
          )} flex items-center justify-center flex-shrink-0 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
        >
          <span className="text-white font-bold text-xl">
            {job.title.charAt(0)}
          </span>
        </div>

        {/* Job Content */}
        <div className="flex-grow min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-grow">
              <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {job.title}
              </h3>
              <p className="text-sm text-slate-600 font-medium">
                {job.jobType}
              </p>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className="text-lg font-bold text-indigo-600">{job.salary}</p>
              <p className="text-xs text-slate-500 mt-1">
                {formatDate(job.createdAt.toString())}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-600 text-sm mb-4 line-clamp-2">
            {job.description}
          </p>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Location */}
            <div className="flex items-center gap-2 text-slate-500">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-sm font-medium">{job.location}</span>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              {job.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="badge badge-primary text-xs"
                >
                  {tag}
                </span>
              ))}
              {job.tags.length > 2 && (
                <span className="text-xs text-indigo-600 font-semibold">
                  +{job.tags.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl"></div>
    </Card>
  );
};

export default JobCard;
