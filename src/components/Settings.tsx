import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { useWorkout } from '../context/WorkoutContext';
import { Scale } from 'lucide-react';

export const Settings: React.FC = () => {
  const { weightUnit, setWeightUnit } = useSettings();
  const { currentWorkout } = useWorkout();

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Scale className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">Weight Unit</h3>
            <p className="text-gray-600 text-sm mb-4">
              Choose your preferred unit for tracking weights
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => !currentWorkout && setWeightUnit('kgs')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  weightUnit === 'kgs'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${currentWorkout ? 'cursor-not-allowed opacity-60' : ''}`}
                disabled={!!currentWorkout}
              >
                Kilograms (KGs)
              </button>
              <button
                onClick={() => !currentWorkout && setWeightUnit('lbs')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  weightUnit === 'lbs'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${currentWorkout ? 'cursor-not-allowed opacity-60' : ''}`}
                disabled={!!currentWorkout}
              >
                Pounds (LBs)
              </button>
            </div>
            {currentWorkout && (
              <p className="mt-3 text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                Weight unit cannot be changed during an active workout
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};