import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onFinishWorkout: () => void;
  onGoToWorkout: () => void;
}

export const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  isOpen,
  onClose,
  onLogout,
  onFinishWorkout,
  onGoToWorkout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
              <h3 className="text-xl font-bold text-gray-900">Workout in Progress</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full -mr-2 -mt-2"
            >
              <X size={20} />
            </button>
          </div>
          
          <p className="text-gray-600 mb-6">
            You have an ongoing workout. What would you like to do?
          </p>
          
          <div className="space-y-3">
            <button
              onClick={onGoToWorkout}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Continue Workout
            </button>
            <button
              onClick={onFinishWorkout}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Finish Workout
            </button>
            <button
              onClick={onLogout}
              className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium"
            >
              Cancel Workout & Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};