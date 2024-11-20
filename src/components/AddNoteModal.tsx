import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddNoteModalProps {
  exerciseName: string;
  setNumber: number;
  currentNote: string;
  onSave: (note: string) => void;
  onClose: () => void;
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({
  exerciseName,
  setNumber,
  currentNote,
  onSave,
  onClose,
}) => {
  const [note, setNote] = useState(currentNote);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="bg-white w-full rounded-t-xl p-4 animate-slide-up">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold">{exerciseName}</h3>
            <p className="text-sm text-gray-500">Set {setNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        <textarea
          placeholder="Add a note..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[100px]"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          autoFocus
        />
        <div className="flex space-x-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(note)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
};