import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Sidebar from "./components/common/Sidebar";
import LoginPage from "./pages/LoginPage";
import OverviewPage from "./pages/OverviewPage";
import UsersPage from "./pages/UsersPage";
import ChalanPage from "./pages/ChalanPage";
import SettingsPage from "./pages/SettingsPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminQueryManagementPage from "./pages/AdminQueryManagementPage";
import { AuthProvider } from "./components/auth/AuthContext";
import { DivisionProvider } from "./contexts/DivisionContext";
import authService from "./services/authService";
import Backdrop from "./components/common/Backdrop";
import DivisionWisePerformance from "./pages/DivisionWisePerformancePage";
import UserManagementPage from "./pages/UserManagementPage";

// Admin-only route component
const AdminRoute = ({ children }) => {
  const userRole = localStorage.getItem("userRole");

  if (userRole !== "main_admin") {
    // Redirect non-admin users to the overview page
    return <Navigate to="/overview" replace />;
  }

  return children;
};

function App() {
  const [username, setUsername] = useState("");

  /**
   * Set local storage variables for later use and handle logout
   * @param {boolean} _isLoggedIn - true is user is logged in
   * @param {string} _username - The username
   */
  function setLocalStorage(_isLoggedIn, _username) {
    setUsername(_username);

    if (_isLoggedIn) {
      //localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", _username);
    } else {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      localStorage.removeItem("userRole");
      localStorage.removeItem("divisionId");
      localStorage.removeItem("divisionName");
      authService.logout();
    }
  }

  // Set auth token on app load if it exists
  // TODO: Might be the cause of auto authentication
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      authService.setToken(token);
    }
  }, []);

  return (
    <AuthProvider>
      <DivisionProvider>
        {/* Background Panel */}
        <div className="flex h-screen bg-bgPrimary text-tBase overflow-hidden">
          {/* Toast notifications */}
          <Toaster position="top-right" />

          {/* TODO: Rename Pages to be more appropriate */}
          {/* Routes to all our pages */}
          {/* Be sure to add Sidebar and Backdrop if you create a new page */}
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Backdrop />
                  <LoginPage setter={setLocalStorage} />
                </>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  <Backdrop />
                  <LoginPage setter={setLocalStorage} />
                </>
              }
            />

            {/* Dashboard data and graphs without extra filters */}
            <Route
              path="/overview"
              element={
                <ProtectedRoute>
                  <Backdrop />
                  <Sidebar />
                  <OverviewPage />
                </ProtectedRoute>
              }
            />

            {/* The actual dashboard with filters */}
            <Route
              path="/volunteers"
              element={
                <ProtectedRoute>
                  <Backdrop />
                  <Sidebar />
                  <UsersPage />
                </ProtectedRoute>
              }
            />

            {/* YASHRAJ: Make sure this is actually protected and you cant just "site/admin..." your way into it */}
            {/* I have added code (Sidebar.jsx) to redirect Admin here and others there */}
            <Route
              path="/adminQueryManagement"
              element={
                <ProtectedRoute>
                  <Backdrop />
                  <Sidebar />
                  <AdminQueryManagementPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/divisionwiseperformance"
              element={
                <ProtectedRoute>
                  <Backdrop />
                  <Sidebar />
                  <DivisionWisePerformance />
                </ProtectedRoute>
              }
            />

            {/* Admin-only route */}
            <Route
              path="/chalan"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <Backdrop />
                    <Sidebar />
                    <ChalanPage />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />

            {/* Admin-only route */}
            <Route
              path="/usermanagement"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <Backdrop />
                    <Sidebar />
                    <UserManagementPage />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Backdrop />
                  <Sidebar />
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </DivisionProvider>
    </AuthProvider>
  );
}

export default App;
