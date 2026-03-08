import { Navigate, Route, Routes } from "react-router-dom";
import ManagerDashboardPage from "./pages/ManagerDashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SetPasswordPage from "./pages/SetPasswordPage";
import TaskDetailsPage from "./pages/TaskDetailsPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import UserDetailsPage from "./pages/UserDetailsPage";
import { AuthProvider, useAuth } from "./lib/auth";

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/set-password/:token" element={<SetPasswordPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ManagerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/task/:taskId"
          element={
            <ProtectedRoute>
              <TaskDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:projectId"
          element={
            <ProtectedRoute>
              <ProjectDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:userId"
          element={
            <ProtectedRoute>
              <UserDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
