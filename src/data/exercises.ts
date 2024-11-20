import { Exercise } from '../types/workout';

export const exercises: Exercise[] = [
  // Cardio
  { 
    id: 'crd1', 
    name: 'Rowing', 
    muscleGroup: 'Cardio',
    metrics: {
      time: true,
      difficulty: true,
      distance: true
    }
  },
  { 
    id: 'crd2', 
    name: 'Treadmill', 
    muscleGroup: 'Cardio',
    metrics: {
      time: true,
      incline: true,
      distance: true
    }
  },
  { 
    id: 'crd3', 
    name: 'Stationary Cycling', 
    muscleGroup: 'Cardio',
    metrics: {
      time: true,
      difficulty: true,
      distance: true
    }
  },
  { 
    id: 'crd4', 
    name: 'Walking', 
    muscleGroup: 'Cardio',
    metrics: {
      time: true,
      pace: true,
      distance: true
    }
  },
  { 
    id: 'crd5', 
    name: 'Skipping', 
    muscleGroup: 'Cardio',
    metrics: {
      time: true
    }
  },
  { 
    id: 'crd6', 
    name: 'Elliptical/Cross-trainer', 
    muscleGroup: 'Cardio',
    metrics: {
      time: true,
      difficulty: true,
      distance: true
    }
  },
  { 
    id: 'crd7', 
    name: 'Swimming', 
    muscleGroup: 'Cardio',
    metrics: {
      time: true
    }
  },
  { 
    id: 'crd8', 
    name: 'Mountain Climber', 
    muscleGroup: 'Cardio',
    metrics: {
      time: true,
      reps: true
    }
  },

  // Shoulders
  { id: 's1', name: 'Seated Shoulder Press (Dumbbells)', muscleGroup: 'Shoulders' },
  { id: 's2', name: 'Seated Shoulder Press (Barbell)', muscleGroup: 'Shoulders' },
  { id: 's3', name: 'Seated Shoulder Press (Smith Machine)', muscleGroup: 'Shoulders' },
  { id: 's4', name: 'Seated Shoulder Press (Machine)', muscleGroup: 'Shoulders' },
  { id: 's5', name: 'Seated Iso Shoulder Press (Hammer)', muscleGroup: 'Shoulders' },
  { id: 's6', name: 'Standing Military Press (Barbell)', muscleGroup: 'Shoulders' },
  { id: 's7', name: 'Standing Military Press (Smith Machine)', muscleGroup: 'Shoulders' },
  { id: 's8', name: 'Arnold Press (Dumbbells)', muscleGroup: 'Shoulders' },
  { id: 's9', name: 'Standing Lateral Raises (Dumbbells)', muscleGroup: 'Shoulders' },
  { id: 's10', name: 'Standing Lateral Raises (Cables)', muscleGroup: 'Shoulders' },
  { id: 's11', name: 'Seated Lateral Raises (Dumbbells)', muscleGroup: 'Shoulders' },
  { id: 's12', name: 'Seated Lateral Raises (Machine)', muscleGroup: 'Shoulders' },
  { id: 's13', name: 'Seated Lateral Raises (Hammer)', muscleGroup: 'Shoulders' },
  { id: 's14', name: 'Standing Lateral Raises (Machine)', muscleGroup: 'Shoulders' },
  { id: 's15', name: 'Standing Lateral Raises (Hammer)', muscleGroup: 'Shoulders' },
  { id: 's16', name: 'Rear Delt Fly (Machine)', muscleGroup: 'Shoulders' },
  { id: 's17', name: 'Single-Arm Rear Delt Fly (Machine)', muscleGroup: 'Shoulders' },
  { id: 's18', name: 'Rear Delt Fly (Cables)', muscleGroup: 'Shoulders' },
  { id: 's19', name: 'Lying Rear Delt Raises (Hammer)', muscleGroup: 'Shoulders' },
  { id: 's20', name: 'Bent-over Rear Delt Raises (Hammer)', muscleGroup: 'Shoulders' },
  { id: 's21', name: 'Bent-over Rear Delt Raises (Machine)', muscleGroup: 'Shoulders' },
  { id: 's22', name: 'Bent-over Rear Delt Raises (Dumbbells)', muscleGroup: 'Shoulders' },
  { id: 's23', name: 'Front Raises (Dumbbells)', muscleGroup: 'Shoulders' },
  { id: 's24', name: 'Front Raises (Plates)', muscleGroup: 'Shoulders' },
  { id: 's25', name: 'Front Raises (Cables)', muscleGroup: 'Shoulders' },
  { id: 's26', name: 'Front Raises (Barbell)', muscleGroup: 'Shoulders' },
  { id: 's27', name: 'Facepulls (Rope Cable)', muscleGroup: 'Shoulders' },
  { id: 's28', name: 'Pike Pushups (Bodyweight)', muscleGroup: 'Shoulders' },
  { id: 's29', name: 'Seated Front Raises (Dumbbells)', muscleGroup: 'Shoulders' },
  { id: 's30', name: 'Seated Iso Smith Shoulder Press (Hammer)', muscleGroup: 'Shoulders' },



  // Chest
  { id: 'c1', name: 'Pushup (Bodyweight)', muscleGroup: 'Chest' },
  { id: 'c2', name: 'Pushups (Weighted)', muscleGroup: 'Chest' },
  { id: 'c3', name: 'Wall Pushups (Bodyweight)', muscleGroup: 'Chest' },
  { id: 'c4', name: 'Decline Pushups (Bodyweight)', muscleGroup: 'Chest' },
  { id: 'c5', name: 'Knee Pushups', muscleGroup: 'Chest' },
  { id: 'c6', name: 'Flat Chest Press (Dumbbell)', muscleGroup: 'Chest' },
  { id: 'c7', name: 'Incline Chest Press (Dumbbell)', muscleGroup: 'Chest' },
  { id: 'c8', name: 'Decline Chest Press (Dumbbell)', muscleGroup: 'Chest' },
  { id: 'c9', name: 'Flat Chest Press (Smith)', muscleGroup: 'Chest' },
  { id: 'c10', name: 'Incline Chest Press (Smith)', muscleGroup: 'Chest' },
  { id: 'c11', name: 'Decline Chest Press (Smith)', muscleGroup: 'Chest' },
  { id: 'c12', name: 'Flat Chest Press (Bench)', muscleGroup: 'Chest' },
  { id: 'c13', name: 'Incline Chest Press (Bench)', muscleGroup: 'Chest' },
  { id: 'c14', name: 'Decline Chest Press (Bench)', muscleGroup: 'Chest' },
  { id: 'c15', name: 'Flat Iso Chest Press (Hammer)', muscleGroup: 'Chest' },
  { id: 'c16', name: 'Incline Iso Chest Press (Hammer)', muscleGroup: 'Chest' },
  { id: 'c17', name: 'Incline Iso Chest Press (Smith Hammer)', muscleGroup: 'Chest' },
  { id: 'c18', name: 'Decline Iso Chest Press (Hammer)', muscleGroup: 'Chest' },
  { id: 'c19', name: 'Cable Flies (Low to High)', muscleGroup: 'Chest' },
  { id: 'c20', name: 'Cable Flies (High to Low)', muscleGroup: 'Chest' },
  { id: 'c21', name: 'Cable Flies (Arm-level)', muscleGroup: 'Chest' },
  { id: 'c22', name: 'Incline Flies (Dumbbell)', muscleGroup: 'Chest' },
  { id: 'c23', name: 'Incline Flies (Cable)', muscleGroup: 'Chest' },
  { id: 'c24', name: 'Decline Flies (Dumbbell)', muscleGroup: 'Chest' },
  { id: 'c25', name: 'Decline Flies (Cable)', muscleGroup: 'Chest' },
  { id: 'c26', name: 'Pec Deck (Single Pulley)', muscleGroup: 'Chest' },
  { id: 'c27', name: 'Pec Deck (Dual Pulley)', muscleGroup: 'Chest' },
  { id: 'c28', name: 'Dips (Bodyweight)', muscleGroup: 'Chest' },
  { id: 'c29', name: 'Dips (Assistance)', muscleGroup: 'Chest' },
  { id: 'c30', name: 'Pullover (Dumbbells)', muscleGroup: 'Chest' },

  // Back
  { id: 'b1', name: 'Lat Pulldown - Wide', muscleGroup: 'Back' },
  { id: 'b2', name: 'Lat Pulldown - Wide (Maggrip)', muscleGroup: 'Back' },
  { id: 'b3', name: 'Lat Pulldown - Close', muscleGroup: 'Back' },
  { id: 'b4', name: 'Lat Pulldown - Close (Maggrip)', muscleGroup: 'Back' },
  { id: 'b5', name: 'Lat Pullover - Rope', muscleGroup: 'Back' },
  { id: 'b6', name: 'Lat Pullover - Bicep Bar', muscleGroup: 'Back' },
  { id: 'b7', name: 'Cable Row - Wide', muscleGroup: 'Back' },
  { id: 'b8', name: 'Cable Row - Wide (Maggrip)', muscleGroup: 'Back' },
  { id: 'b9', name: 'Cable Row - Close', muscleGroup: 'Back' },
  { id: 'b10', name: 'Cable Row - Close (Maggrip)', muscleGroup: 'Back' },
  { id: 'b11', name: 'Iso Lat Pulldown (Hammer)', muscleGroup: 'Back' },
  { id: 'b12', name: 'Iso Reverse Grip Lat Pulldown (Hammer)', muscleGroup: 'Back' },
  { id: 'b13', name: 'Iso Reverse Grip 2 Lat Pulldown (Hammer)', muscleGroup: 'Back' },
  { id: 'b14', name: 'Iso Neutral Lat Pulldown (Hammer)', muscleGroup: 'Back' },
  { id: 'b15', name: 'Iso Machine Rows (Hammer)', muscleGroup: 'Back' },
  { id: 'b16', name: 'Machine Rows (Hammer)', muscleGroup: 'Back' },
  { id: 'b17', name: 'Deadlifts', muscleGroup: 'Back' },
  { id: 'b18', name: 'Single Arm DB Rows', muscleGroup: 'Back' },
  { id: 'b19', name: 'Barbell Rows', muscleGroup: 'Back' },
  { id: 'b20', name: 'Hip supported Rows (Hammer)', muscleGroup: 'Back' },
  { id: 'b21', name: 'Back Extensions', muscleGroup: 'Back' },
  { id: 'b22', name: 'Wide-grip Pullups (Bodyweight)', muscleGroup: 'Back' },
  { id: 'b23', name: 'Wide-grip Pullups (Weighted)', muscleGroup: 'Back' },
  { id: 'b24', name: 'Wide-grip Pullups (Assisted)', muscleGroup: 'Back' },
  { id: 'b25', name: 'Neutral-grip Pullups (Bodyweight)', muscleGroup: 'Back' },
  { id: 'b26', name: 'Neutral-grip Pullups (Weighted)', muscleGroup: 'Back' },
  { id: 'b27', name: 'Neutral-grip Pullups (Assisted)', muscleGroup: 'Back' },
  { id: 'b28', name: 'Chinups (Bodyweight)', muscleGroup: 'Back' },
  { id: 'b29', name: 'Chinups Pullups (Weighted)', muscleGroup: 'Back' },
  { id: 'b30', name: 'Chinups Pullups (Assisted)', muscleGroup: 'Back' },
  { id: 'b31', name: 'Good Mornings (Barbell)', muscleGroup: 'Back' },
  { id: 'b32', name: 'Shrugs (Dumbbell)', muscleGroup: 'Back' },
  { id: 'b33', name: 'Shrugs (Smith Machine)', muscleGroup: 'Back' },
  { id: 'b34', name: 'Shrugs (Barbell)', muscleGroup: 'Back' },
  { id: 'b35', name: 'Shrugs (Hammer)', muscleGroup: 'Back' },
  { id: 'b36', name: 'T-bar Row (Hammer)', muscleGroup: 'Back' },
  { id: 'b37', name: 'T-bar Row (Generic)', muscleGroup: 'Back' },


  // Quads
  { id: 'q1', name: 'Squats (Bodyweight)', muscleGroup: 'Quads' },
  { id: 'q2', name: 'Sumo Squats (Bodyweight)', muscleGroup: 'Quads' },
  { id: 'q3', name: 'Goblet Squats (Bodyweight)', muscleGroup: 'Quads' },
  { id: 'q4', name: 'Barbell Squats', muscleGroup: 'Quads' },
  { id: 'q5', name: 'Smith Machine Squats (Close Stance)', muscleGroup: 'Quads' },
  { id: 'q6', name: 'Smith Machine Squats (Sumo Stance)', muscleGroup: 'Quads' },
  { id: 'q7', name: 'Goblet Squat (Dumbbell)', muscleGroup: 'Quads' },
  { id: 'q8', name: 'Sumo Squat (Dumbbell)', muscleGroup: 'Quads' },
  { id: 'q9', name: 'Hack Squat', muscleGroup: 'Quads' },
  { id: 'q10', name: 'Hack Squat (Hammer)', muscleGroup: 'Quads' },
  { id: 'q11', name: 'Pendulum Squat (Hammer)', muscleGroup: 'Quads' },
  { id: 'q12', name: 'Machine Squat (Hammer)', muscleGroup: 'Quads' },
  { id: 'q13', name: 'V-Squat (Hammer)', muscleGroup: 'Quads' },
  { id: 'q14', name: 'Leg Extensions (Hammer)', muscleGroup: 'Quads' },
  { id: 'q15', name: 'Leg Extensions (Generic)', muscleGroup: 'Quads' },
  { id: 'q16', name: 'Iso Leg Extensions (Hammer)', muscleGroup: 'Quads' },
  { id: 'q17', name: 'Leg Press (Generic)', muscleGroup: 'Quads' },
  { id: 'q18', name: 'Leg Press (Hammer)', muscleGroup: 'Quads' },
  { id: 'q19', name: 'Vertical Leg Press (Hammer)', muscleGroup: 'Quads' },
  { id: 'q20', name: 'Spot Lunges (Dumbbells)', muscleGroup: 'Quads' },
  { id: 'q21', name: 'Spot Lunges (Barbell)', muscleGroup: 'Quads' },
  { id: 'q22', name: 'Spot Lunges (Kettlebells)', muscleGroup: 'Quads' },
  { id: 'q23', name: 'Spot Lunges (Smith Machine)', muscleGroup: 'Quads' },
  { id: 'q24', name: 'Spot Lunges (Plate loaded)', muscleGroup: 'Quads' },
  { id: 'q25', name: 'Walking Lunges (Dumbbell)', muscleGroup: 'Quads' },
  { id: 'q26', name: 'Walking Lunges (Barbell)', muscleGroup: 'Quads' },
  { id: 'q27', name: 'Walking Lunges (Kettlebell)', muscleGroup: 'Quads' },
  { id: 'q28', name: 'Walking Lunges (Weighted bag)', muscleGroup: 'Quads' },
  { id: 'q29', name: 'Walking Lunges (Plate loaded)', muscleGroup: 'Quads' },


  // Hamstrings
  { id: 'h1', name: 'Lying Leg Curl (Generic)', muscleGroup: 'Hamstrings' },
  { id: 'h2', name: 'Lying Leg Curl (Hammer)', muscleGroup: 'Hamstrings' },
  { id: 'h3', name: 'Romanian Deadlifts (Dumbbell)', muscleGroup: 'Hamstrings' },
  { id: 'h4', name: 'Romanian Deadlifts (Barbell)', muscleGroup: 'Hamstrings' },
  { id: 'h5', name: 'Romanian Deadlifts (Smith Machine)', muscleGroup: 'Hamstrings' },
  { id: 'h6', name: 'Seated Leg Curl (Hammer)', muscleGroup: 'Hamstrings' },
  { id: 'h7', name: 'Seated Leg Curl (Generic)', muscleGroup: 'Hamstrings' },
  { id: 'h9', name: 'Stiff-Legged Deadlifts (Barbell)', muscleGroup: 'Hamstrings' },
  { id: 'h10', name: 'Stiff-Legged Deadlifts (Dumbbell)', muscleGroup: 'Hamstrings' },
  { id: 'h11', name: 'Iso Leg Curls (Hammer)', muscleGroup: 'Hamstrings' },


  // Triceps
  { id: 't1', name: 'Tricep Extensions (Cable - Straight bar)', muscleGroup: 'Triceps' },
  { id: 't2', name: 'Tricep Extensions (EZ Bar)', muscleGroup: 'Triceps' },
  { id: 't3', name: 'Tricep Extensions (Dumbbell Both Hands)', muscleGroup: 'Triceps' },
  { id: 't4', name: 'Tricep Extensions (Dumbbell Single Hand)', muscleGroup: 'Triceps' },
  { id: 't5', name: 'Tricep Extensions (Cable - Rope)', muscleGroup: 'Triceps' },
  { id: 't6', name: 'Tricep Pushdown (Straight bar)', muscleGroup: 'Triceps' },
  { id: 't7', name: 'Tricep Pushdown (Rope)', muscleGroup: 'Triceps' },
  { id: 't8', name: 'Tricep Pushdown (V bar)', muscleGroup: 'Triceps' },
  { id: 't9', name: 'Tricep Pushdown (Underhand)', muscleGroup: 'Triceps' },
  { id: 't10', name: 'Close-Grip Bench Press (Barbell)', muscleGroup: 'Triceps' },
  { id: 't11', name: 'Close-Grip Bench Press (Smith)', muscleGroup: 'Triceps' },
  { id: 't12', name: 'Diamond Pushups (Bodyweight)', muscleGroup: 'Triceps' },
  { id: 't13', name: 'Tricep Dips (Hammer)', muscleGroup: 'Triceps' },
  { id: 't14', name: 'Tricep Dips (Generic)', muscleGroup: 'Triceps' },
  { id: 't15', name: 'Tricep Extensions (V bar)', muscleGroup: 'Triceps' },
  { id: 't16', name: 'Tricep Skullcrusher (EZ bar)', muscleGroup: 'Triceps' },

  // Biceps
  { id: 'bi1', name: 'Bicep Curls (Dumbbells)', muscleGroup: 'Biceps' },
  { id: 'bi2', name: 'Bicep Curls (Cable - Straight bar)', muscleGroup: 'Biceps' },
  { id: 'bi3', name: 'Bicep Curls (Cable - EZ bar)', muscleGroup: 'Biceps' },
  { id: 'bi4', name: 'Bicep Curls (EZ bar)', muscleGroup: 'Biceps' },
  { id: 'bi5', name: 'Bicep Curls (Straight bar)', muscleGroup: 'Biceps' },
  { id: 'bi6', name: 'Bicep Curls (Cable - Rope)', muscleGroup: 'Biceps' },
  { id: 'bi7', name: 'Incline Bicep Curls (Dumbbells)', muscleGroup: 'Biceps' },
  { id: 'bi8', name: 'Bayesian Curls (Cable - Iso)', muscleGroup: 'Biceps' },
  { id: 'bi9', name: 'Preacher Curls (EZ bar)', muscleGroup: 'Biceps' },
  { id: 'bi10', name: 'Preacher Curls (Dumbbells)', muscleGroup: 'Biceps' },
  { id: 'bi11', name: 'Preacher Curls (Machine)', muscleGroup: 'Biceps' },
  { id: 'bi12', name: 'Preacher Curls (Hammer)', muscleGroup: 'Biceps' },
  { id: 'bi13', name: 'Hammer Curls (Dumbbells)', muscleGroup: 'Biceps' },
  { id: 'bi14', name: 'Hammer Curls (Cable - Rope)', muscleGroup: 'Biceps' },
  { id: 'bi15', name: 'Hammer Curls (Hex barbell)', muscleGroup: 'Biceps' },
  { id: 'bi16', name: 'Concentration Curls (Dumbbells)', muscleGroup: 'Biceps' },

  // Glutes
  { id: 'g1', name: 'Hip Adductors', muscleGroup: 'Glutes' },
  { id: 'g2', name: 'Hip Abductors', muscleGroup: 'Glutes' },
  { id: 'g3', name: 'Hip Thrust (Barbell)', muscleGroup: 'Glutes' },
  { id: 'g4', name: 'Hip Thrust (Smith)', muscleGroup: 'Glutes' },
  { id: 'g5', name: 'Hip Thrust (Machine)', muscleGroup: 'Glutes' },
  { id: 'g6', name: 'Hip Thrust (Dumbbell)', muscleGroup: 'Glutes' },
  { id: 'g7', name: 'Glute kickbacks (Bodyweight)', muscleGroup: 'Glutes' },

  // Calves
  { id: 'ca1', name: 'Standing Calf Raises (Machine)', muscleGroup: 'Calves' },
  { id: 'ca2', name: 'Standing Calf Raises (V-Squat)', muscleGroup: 'Calves' },
  { id: 'ca3', name: 'Standing Calf Raises (Smith)', muscleGroup: 'Calves' },
  { id: 'ca4', name: 'Leg Press Calf Raises (Generic)', muscleGroup: 'Calves' },
  { id: 'ca5', name: 'Leg Press Calf Raises (Hammer)', muscleGroup: 'Calves' },
  { id: 'ca6', name: 'Seated Calf Raises (Machine)', muscleGroup: 'Calves' },
  { id: 'ca7', name: 'Standing Calf Raises (Bodyweight)', muscleGroup: 'Calves' },

  // Core
  { id: 'co1', name: 'Crunches (Bodyweight)', muscleGroup: 'Core' },
  { id: 'co2', name: 'Crunches (Machine)', muscleGroup: 'Core' },
  { id: 'co3', name: 'Crunches (Cable)', muscleGroup: 'Core' },
  { id: 'co5', name: 'Decline Crunches (Weighted)', muscleGroup: 'Core' },
  { id: 'co6', name: 'Decline Crunches (Bodyweight)', muscleGroup: 'Core' },
  { id: 'co7', name: 'Russian Twists (Bodyweight)', muscleGroup: 'Core' },
  { id: 'co8', name: 'Russian Twists (Weighted)', muscleGroup: 'Core' },
  { id: 'co9', name: 'Boat Hold (Time)', muscleGroup: 'Core', metrics: { time: true } },
  { id: 'co10', name: 'Alternate toe touch', muscleGroup: 'Core' },
  { id: 'co11', name: 'Hanging Knee Raises (Bodyweight)', muscleGroup: 'Core' },
  { id: 'co12', name: 'Hanging Leg Raises (Bodyweight)', muscleGroup: 'Core' },
  { id: 'co13', name: 'Lying Leg Raises (Bodyweight)', muscleGroup: 'Core' },
  { id: 'co14', name: 'Plank (Time)', muscleGroup: 'Core', metrics: { time: true } },
];