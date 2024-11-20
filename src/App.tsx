import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WorkoutProvider, useWorkout } from './context/WorkoutContext';
import { SettingsProvider } from './context/SettingsContext';
import { Navigation } from './components/Navigation';
import { ExerciseList } from './components/ExerciseList';
import { WorkoutSession } from './components/WorkoutSession';
import { WorkoutLogs } from './components/WorkoutLogs';
import { Settings } from './components/Settings';
import { Login } from './components/Auth/Login';
import { SignUp } from './components/Auth/SignUp';
import { MigrationStatus } from './components/MigrationStatus';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const { user } = useAuth();
  const { currentWorkout } = useWorkout();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isWorkoutRoute = location.pathname === '/workout';

  useEffect(() => {
    // Allow time for auth and workout state to hydrate
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Show loading state while checking auth and workout status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  // Handle public routes
  if (!user) {
    if (location.pathname === '/login' || location.pathname === '/signup') {
      return (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      );
    }
    return <Navigate to="/login" replace />;
  }

  // Hide navigation on mobile during workout
  const showNavigation = !isMobile || (isMobile && (!currentWorkout || !isWorkoutRoute));

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavigation && <Navigation />}
      <div className={showNavigation ? "pt-16" : ""}>
        <Routes>
          <Route path="/" element={<ExerciseList />} />
          <Route path="/workout" element={<WorkoutSession />} />
          <Route path="/logs" element={<WorkoutLogs />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <MigrationStatus />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <WorkoutProvider>
          <AppContent />
        </WorkoutProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;