import React, { useState } from 'react';
import { MoreVertical, X } from 'lucide-react';
import { WorkoutSet, Exercise } from '../types/workout';

interface MobileSetRowProps {
  set: WorkoutSet;
  exercise: Exercise;
  onUpdate: (field: string, value: any) => void;
  onDelete: () => void;
  onOpenNoteModal: () => void;
}

export const MobileSetRow: React.FC<MobileSetRowProps> = ({
  set,
  exercise,
  onUpdate,
  onDelete,
  onOpenNoteModal,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const isCardio = exercise.muscleGroup === 'Cardio';
  const isTimeBasedCore = exercise.muscleGroup === 'Core' && exercise.metrics?.time;
  const isBodyweight = exercise.name.includes('(Bodyweight)');
  const isTimeOnly = exercise.metrics?.time && !exercise.metrics?.distance && !exercise.metrics?.difficulty && !exercise.metrics?.incline && !exercise.metrics?.pace && !exercise.metrics?.reps;

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Handle backspace and deletion
    if (value.length < (set.time || '').length) {
      onUpdate('time', value);
      return;
    }

    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    
    if (digits.length <= 2) {
      // Less than 2 digits - treat as seconds
      const seconds = parseInt(digits || '0');
      if (seconds < 60) {
        onUpdate('time', `0:${digits.padStart(2, '0')}`);
      }
    } else {
      // More than 2 digits - treat as MMSS
      const minutes = parseInt(digits.slice(0, -2));
      const seconds = parseInt(digits.slice(-2));
      if (seconds < 60) {
        onUpdate('time', `${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    }
  };

  const getColumnClass = (hasValue: boolean) => 
    `px-2 py-1.5 border ${hasValue ? 'border-gray-300' : 'border-gray-200'} rounded-lg text-sm w-full ${hasValue ? '' : 'bg-gray-50 text-gray-400'}`;

  return (
    <div className="grid grid-cols-[50px_1fr_1fr_1fr_32px] gap-2 items-center py-1 relative">
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-600 mr-1">{set.setNumber}</span>
        <div className="relative flex -space-x-1">
          {set.isPR && (
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          )}
          {set.comments && (
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          )}
        </div>
      </div>

      {/* First Column */}
      {isCardio || isTimeBasedCore ? (
        <input
          type="text"
          placeholder="mm:ss"
          className={getColumnClass(true)}
          value={set.time || ''}
          onChange={handleTimeChange}
        />
      ) : isBodyweight ? (
        <div className={getColumnClass(false)}>BW</div>
      ) : (
        <input
          type="number"
          step="0.25"
          min="0"
          placeholder="-"
          className={getColumnClass(true)}
          value={set.weight || ''}
          onChange={(e) => onUpdate('weight', e.target.value)}
        />
      )}

      {/* Second Column */}
      {isCardio ? (
        exercise.metrics?.distance ? (
          <input
            type="number"
            min="0"
            placeholder="Distance (m)"
            className={getColumnClass(true)}
            value={set.distance || ''}
            onChange={(e) => onUpdate('distance', parseFloat(e.target.value))}
          />
        ) : exercise.metrics?.reps ? (
          <input
            type="number"
            min="0"
            placeholder="Reps"
            className={getColumnClass(true)}
            value={set.performedReps || ''}
            onChange={(e) => onUpdate('performedReps', e.target.value)}
          />
        ) : (
          <div className={getColumnClass(false)}>-</div>
        )
      ) : isTimeBasedCore ? (
        <div className={getColumnClass(false)}>-</div>
      ) : (
        <input
          type="number"
          min="0"
          placeholder="0"
          className={getColumnClass(true)}
          value={set.targetReps || ''}
          onChange={(e) => onUpdate('targetReps', parseInt(e.target.value))}
        />
      )}

      {/* Third Column */}
      {isCardio ? (
        exercise.metrics?.difficulty ? (
          <input
            type="number"
            min="0"
            max="20"
            placeholder="Difficulty"
            className={getColumnClass(true)}
            value={set.difficulty || ''}
            onChange={(e) => onUpdate('difficulty', parseInt(e.target.value))}
          />
        ) : exercise.metrics?.incline ? (
          <input
            type="number"
            min="0"
            max="15"
            placeholder="Incline %"
            className={getColumnClass(true)}
            value={set.incline || ''}
            onChange={(e) => onUpdate('incline', parseInt(e.target.value))}
          />
        ) : exercise.metrics?.pace ? (
          <input
            type="text"
            placeholder="Pace"
            className={getColumnClass(true)}
            value={set.pace || ''}
            onChange={(e) => onUpdate('pace', e.target.value)}
          />
        ) : (
          <div className={getColumnClass(false)}>-</div>
        )
      ) : isTimeBasedCore ? (
        <div className={getColumnClass(false)}>-</div>
      ) : (
        <input
          type="number"
          min="0"
          placeholder="0"
          className={getColumnClass(true)}
          value={set.performedReps}
          onChange={(e) => onUpdate('performedReps', e.target.value)}
        />
      )}

      <button
        onClick={() => setShowMenu(true)}
        className="p-1 hover:bg-gray-100 rounded-lg flex justify-center h-8"
      >
        <MoreVertical size={20} />
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl z-50 animate-slide-up">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3" />
            <div className="p-4 space-y-2">
              <button
                onClick={() => {
                  onUpdate('isPR', !set.isPR);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-3 text-left text-base flex items-center space-x-3 hover:bg-gray-50 rounded-lg"
              >
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <span>{set.isPR ? 'Remove PR' : 'Mark as PR'}</span>
              </button>
              <button
                onClick={() => {
                  onOpenNoteModal();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-3 text-left text-base flex items-center space-x-3 hover:bg-gray-50 rounded-lg"
              >
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>Add Note</span>
              </button>
              <button
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-3 text-left text-base flex items-center space-x-3 hover:bg-gray-50 rounded-lg text-red-600"
              >
                <X size={16} />
                <span>Delete Set</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};