import React from 'react';
import { X, Medal } from 'lucide-react';
import { WorkoutSet, Exercise } from '../types/workout';
import { useSettings } from '../context/SettingsContext';

interface SetRowProps {
  set: WorkoutSet;
  exercise: Exercise;
  onUpdate: (field: string, value: any) => void;
  onDelete: () => void;
}

export const SetRow: React.FC<SetRowProps> = ({ set, exercise, onUpdate, onDelete }) => {
  const { weightUnit } = useSettings();
  const isBodyweight = exercise.name.includes('(Bodyweight)');
  const isCardio = exercise.muscleGroup === 'Cardio';
  const isTimeBasedCore = exercise.muscleGroup === 'Core' && exercise.metrics?.time;
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
    `px-2 py-1.5 border ${hasValue ? 'border-gray-300' : 'border-gray-200'} rounded-md text-sm w-full ${hasValue ? '' : 'bg-gray-50 text-gray-400'}`;

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:grid md:grid-cols-[35px_1fr_1fr_1fr_1.2fr_100px] gap-2 items-center">
        <div className="flex items-center justify-center">
          <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center font-semibold text-gray-700 text-sm">
            {set.setNumber}
          </span>
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

        <input
          type="text"
          placeholder="Add note"
          className={getColumnClass(true)}
          value={set.comments}
          onChange={(e) => onUpdate('comments', e.target.value)}
        />
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onUpdate('isPR', !set.isPR)}
            className={`px-2 py-1 rounded text-xs font-medium flex items-center space-x-1 transition-all ${
              set.isPR 
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' 
                : 'border border-yellow-400 text-yellow-600 hover:bg-yellow-50'
            }`}
          >
            <Medal size={14} />
            <span>PR</span>
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-red-600 hover:bg-red-50 rounded-full"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center font-semibold text-gray-700 text-sm">
              {set.setNumber}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onUpdate('isPR', !set.isPR)}
              className={`px-2 py-1 rounded text-xs font-medium flex items-center space-x-1 transition-all ${
                set.isPR 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' 
                  : 'border border-yellow-400 text-yellow-600'
              }`}
            >
              <Medal size={14} />
              <span>PR</span>
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-red-600 rounded-full"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {isCardio || isTimeBasedCore ? (
            <>
              <div className="relative">
                <input
                  type="text"
                  placeholder="mm:ss"
                  className={getColumnClass(true)}
                  value={set.time || ''}
                  onChange={handleTimeChange}
                />
              </div>
              {!isTimeOnly && !isTimeBasedCore && (
                <>
                  {exercise.metrics?.distance && (
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        placeholder="Distance (m)"
                        className={getColumnClass(true)}
                        value={set.distance || ''}
                        onChange={(e) => onUpdate('distance', parseFloat(e.target.value))}
                      />
                    </div>
                  )}
                  {exercise.metrics?.difficulty && (
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        placeholder="Difficulty"
                        className={getColumnClass(true)}
                        value={set.difficulty || ''}
                        onChange={(e) => onUpdate('difficulty', parseInt(e.target.value))}
                      />
                    </div>
                  )}
                  {exercise.metrics?.incline && (
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="15"
                        placeholder="Incline %"
                        className={getColumnClass(true)}
                        value={set.incline || ''}
                        onChange={(e) => onUpdate('incline', parseInt(e.target.value))}
                      />
                    </div>
                  )}
                  {exercise.metrics?.pace && (
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Pace"
                        className={getColumnClass(true)}
                        value={set.pace || ''}
                        onChange={(e) => onUpdate('pace', e.target.value)}
                      />
                    </div>
                  )}
                  {exercise.metrics?.reps && (
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        placeholder="Reps"
                        className={getColumnClass(true)}
                        value={set.performedReps || ''}
                        onChange={(e) => onUpdate('performedReps', e.target.value)}
                      />
                    </div>
                  )}
                </>
              )}
              {isTimeBasedCore && (
                <>
                  <div className={getColumnClass(false)}>-</div>
                  <div className={getColumnClass(false)}>-</div>
                </>
              )}
            </>
          ) : (
            <>
              {isBodyweight ? (
                <div className="relative">
                  <div className={getColumnClass(false)}>BW</div>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    placeholder="Weight"
                    className={`${getColumnClass(true)} pr-8`}
                    value={set.weight || ''}
                    onChange={(e) => onUpdate('weight', e.target.value)}
                  />
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    {weightUnit}
                  </span>
                </div>
              )}
              <input
                type="number"
                min="0"
                placeholder="Goal"
                className={getColumnClass(true)}
                value={set.targetReps || ''}
                onChange={(e) => onUpdate('targetReps', parseInt(e.target.value))}
              />
              <input
                type="text"
                placeholder="Actual"
                className={getColumnClass(true)}
                value={set.performedReps}
                onChange={(e) => onUpdate('performedReps', e.target.value)}
              />
            </>
          )}
        </div>
        <input
          type="text"
          placeholder="Notes"
          className={`w-full ${getColumnClass(true)}`}
          value={set.comments}
          onChange={(e) => onUpdate('comments', e.target.value)}
        />
      </div>
    </>
  );
};