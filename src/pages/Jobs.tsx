import React, { useState, useEffect } from "react";
import axios from "axios";
import { type Job } from "../services/seed/jobsSeed";
import JobCard from "../components/common/JobCard";
import SimpleJobSkeleton from "../components/common/SimpleJobSkeleton";
import JobModal from "../components/Jobs/JobModal";
import { DeleteConfirmationModal } from "../components/Jobs/DeleteConfirmationModal";
import Button from "../components/ui/Button";
import { toast } from "react-hot-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Job Card Wrapper
const SortableJobCard: React.FC<{ job: Job }> = ({ job }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <JobCard job={job} />
    </div>
  );
};

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    job: Job | null;
  }>({ isOpen: false, job: null });

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "archived">(
    "all"
  );
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const pageSize = 9;

  // Drag and Drop
  const [isDragMode, setIsDragMode] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(typeFilter !== "All" && { jobType: typeFilter }),
      });

      const response = await axios.get(`/jobs?${params}`);
      setJobs(response.data.data);
      setTotalJobs(response.data.total);
      setTotalPages(Math.ceil(response.data.total / pageSize));
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [currentPage, searchTerm, statusFilter, typeFilter]);

  const handleCreateJob = () => {
    setSelectedJob(null);
    setIsModalOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleDeleteJob = (job: Job) => {
    setDeleteModal({ isOpen: true, job });
  };

  const confirmDelete = async () => {
    if (!deleteModal.job) return;

    try {
      await axios.delete(`/jobs/${deleteModal.job.id}`);
      toast.success("Job deleted successfully!");
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job");
    } finally {
      setDeleteModal({ isOpen: false, job: null });
    }
  };

  const handleArchiveToggle = async (job: Job) => {
    try {
      const newStatus = job.status === "active" ? "archived" : "active";
      await axios.patch(`/jobs/${job.id}`, { status: newStatus });
      toast.success(
        `Job ${newStatus === "archived" ? "archived" : "unarchived"} successfully!`
      );
      fetchJobs();
    } catch (error) {
      console.error("Error updating job status:", error);
      toast.error("Failed to update job status");
    }
  };

  // Drag and Drop Handler with Optimistic Updates
  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = jobs.findIndex((job) => job.id === active.id);
    const newIndex = jobs.findIndex((job) => job.id === over.id);

    // Optimistic update
    const originalJobs = [...jobs];
    const newJobs = arrayMove(jobs, oldIndex, newIndex);
    setJobs(newJobs);

    try {
      // Simulate 10% failure rate for testing rollback
      if (Math.random() < 0.1) {
        throw new Error("Simulated reorder failure");
      }

      // Make API call
      await axios.patch(`/jobs/${active.id}/reorder`, {
        fromOrder: oldIndex,
        toOrder: newIndex,
      });
      toast.success("Job order updated!");
    } catch (error) {
      // Rollback on failure
      console.error("Error reordering jobs:", error);
      toast.error("Failed to reorder jobs. Changes reverted.");
      setJobs(originalJobs); // Rollback to original order
    }
  };

  const jobTypes = ["All", "Full-time", "Part-time", "Remote", "Contract"];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Job Openings
              </h1>
              <p className="text-slate-600">
                {totalJobs} {totalJobs === 1 ? "position" : "positions"}{" "}
                available
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant={isDragMode ? "secondary" : "outline"}
                onClick={() => setIsDragMode(!isDragMode)}
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
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                }
              >
                {isDragMode ? "Exit Reorder" : "Reorder Jobs"}
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateJob}
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
                Create Job
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search jobs by title or tags..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="input-modern pl-12"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-3">
              {/* Status Filter */}
              <div className="flex gap-2">
                {["all", "active", "archived"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status as "all" | "active" | "archived");
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      statusFilter === status
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              <div className="h-8 w-px bg-slate-300"></div>

              {/* Type Filter */}
              <div className="flex gap-2">
                {jobTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setTypeFilter(type);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      typeFilter === type
                        ? "bg-purple-600 text-white shadow-lg"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Grid/List */}
        {loading ? (
          <SimpleJobSkeleton />
        ) : jobs.length === 0 ? (
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              No jobs found
            </h3>
            <p className="text-slate-600 mb-6">
              Try adjusting your filters or create a new job
            </p>
            <Button variant="primary" onClick={handleCreateJob}>
              Create New Job
            </Button>
          </div>
        ) : isDragMode ? (
          // Drag and Drop Mode
          <div className="mb-8">
            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 mb-6 flex items-center gap-3">
              <svg
                className="w-6 h-6 text-indigo-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-indigo-900 font-medium">
                Drag and drop jobs to reorder them. Changes are saved automatically with a 10% simulated failure rate for testing rollback.
              </p>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={jobs.map((j) => j.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="relative">
                      <SortableJobCard job={job} />
                      {/* Drag Handle Indicator */}
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50">
                        <svg
                          className="w-6 h-6 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 8h16M4 16h16"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        ) : (
          // Normal Grid Mode
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {jobs.map((job) => (
              <div key={job.id} className="relative group">
                <JobCard job={job} />
                {/* Action Buttons Overlay */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditJob(job);
                    }}
                    className="p-2 bg-white rounded-lg shadow-lg hover:bg-indigo-50 transition-colors"
                    title="Edit Job"
                  >
                    <svg
                      className="w-4 h-4 text-indigo-600"
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
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArchiveToggle(job);
                    }}
                    className="p-2 bg-white rounded-lg shadow-lg hover:bg-yellow-50 transition-colors"
                    title={job.status === "active" ? "Archive" : "Unarchive"}
                  >
                    <svg
                      className="w-4 h-4 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteJob(job);
                    }}
                    className="p-2 bg-white rounded-lg shadow-lg hover:bg-red-50 transition-colors"
                    title="Delete Job"
                  >
                    <svg
                      className="w-4 h-4 text-red-600"
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
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && jobs.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
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
            </Button>

            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let page;
              if (totalPages <= 7) {
                page = i + 1;
              } else if (currentPage <= 4) {
                page = i + 1;
              } else if (currentPage >= totalPages - 3) {
                page = totalPages - 6 + i;
              } else {
                page = currentPage - 3 + i;
              }
              return page;
            }).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                  currentPage === page
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {page}
              </button>
            ))}

            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      {isModalOpen && (
        <JobModal
          job={selectedJob}
          onClose={() => setIsModalOpen(false)}
          onSave={() => {
            setIsModalOpen(false);
            fetchJobs();
          }}
        />
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, job: null })}
        onConfirm={confirmDelete}
        jobTitle={deleteModal.job?.title || ""}
      />
    </div>
  );
};

export default Jobs;
