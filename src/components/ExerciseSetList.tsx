import React from 'react';
import { Medal } from 'lucide-react';
import { Exercise, WorkoutSet } from '../types/workout';
import { useSettings } from '../context/SettingsContext';

interface ExerciseSetListProps {
  exercise: Exercise;
  sets: WorkoutSet[];
}

export const ExerciseSetList: React.FC<ExerciseSetListProps> = ({ exercise, sets }) => {
  const { weightUnit, convertWeight } = useSettings();
  const isBodyweight = exercise.name.includes('(Bodyweight)');
  const isCardio = exercise.muscleGroup === 'Cardio';
  const isTimeBasedCore = exercise.muscleGroup === 'Core' && exercise.metrics?.time;

  const getSetValue = (set: WorkoutSet, field: string) => {
    switch (field) {
      case 'Weight':
        if (isBodyweight) return 'BW';
        const weight = set.weight || 0;
        return weightUnit === 'lb' 
          ? `${convertWeight(weight, 'kg', 'lb').toFixed(2)} ${weightUnit}`
          : `${weight} ${weightUnit}`;
      case 'Goal':
        return set.targetReps || '-';
      case 'Actual':
        return set.performedReps || '-';
      case 'Time':
        return set.time || '-';
      case 'Distance':
        return set.distance ? `${set.distance}m` : '-';
      case 'Difficulty':
        return set.difficulty || '-';
      case 'Incline':
        return set.incline ? `${set.incline}%` : '-';
      case 'Pace':
        return set.pace || '-';
      default:
        return '-';
    }
  };

  const getHeaders = () => {
    if (isCardio) {
      const headers = ['Time'];
      if (exercise.metrics?.distance) headers.push('Distance');
      if (exercise.metrics?.difficulty) headers.push('Difficulty');
      if (exercise.metrics?.incline) headers.push('Incline');
      if (exercise.metrics?.pace) headers.push('Pace');
      if (exercise.metrics?.reps) headers.push('Reps');
      return headers;
    }
    if (isTimeBasedCore) {
      return ['Time'];
    }
    return ['Weight', 'Goal', 'Actual'];
  };

  return (
    <div className="p-4 border-b last:border-b-0">
      <h4 className="font-medium text-gray-900 mb-3">{exercise.name}</h4>
      
      {/* Desktop View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500">
              <th className="pr-4 font-medium">Set</th>
              {getHeaders().map(header => (
                <th key={header} className="pr-4 font-medium">{header}</th>
              ))}
              <th className="pr-4 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {sets.map((set, index) => (
              <tr key={set.id} className="border-t border-gray-100">
                <td className="py-2 pr-4 font-medium">{index + 1}</td>
                {getHeaders().map(header => (
                  <td key={header} className="py-2 pr-4">
                    {getSetValue(set, header)}
                  </td>
                ))}
                <td className="py-2 pr-4">
                  <div className="flex items-center space-x-2">
                    {set.comments && (
                      <span className="text-gray-600">{set.comments}</span>
                    )}
                    {set.isPR && (
                      <span className="inline-flex items-center text-yellow-600">
                        <Medal size={16} className="mr-1" />
                        PR
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden space-y-3">
        {sets.map((set, index) => (
          <div 
            key={set.id}
            className={`p-3 rounded-lg ${
              set.isPR ? 'bg-yellow-50 border border-yellow-100' : 'bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium text-gray-700">Set {index + 1}</span>
              {set.isPR && (
                <span className="inline-flex items-center text-yellow-600 text-sm">
                  <Medal size={14} className="mr-1" />
                  PR
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {getHeaders().map(header => (
                <div key={header}>
                  <span className="text-gray-500">{header}:</span>{' '}
                  <span className="font-medium">{getSetValue(set, header)}</span>
                </div>
              ))}
            </div>
            {set.comments && (
              <div className="mt-2 text-sm text-gray-600 bg-white/50 p-2 rounded">
                {set.comments}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};