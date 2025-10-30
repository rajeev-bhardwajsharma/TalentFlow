import React from "react";
import Button from "../ui/Button";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  jobTitle: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  jobTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-slide-up">
        {/* Warning Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-slate-900 text-center mb-3">
          Delete Job Position?
        </h3>
        <p className="text-slate-600 text-center mb-2">
          Are you sure you want to delete
        </p>
        <p className="text-lg font-bold text-slate-900 text-center mb-6">
          "{jobTitle}"
        </p>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-red-800 text-center">
            This action cannot be undone. All associated data will be permanently removed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={onClose} variant="outline" fullWidth>
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="danger" fullWidth>
            Delete Job
          </Button>
        </div>
      </div>
    </div>
  );
};
