// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../stores/authStore";

// You can create a more elaborate loading spinner component
const LoadingScreen = () => (
  <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
    <h1>Loading...</h1>
  </div>
);

const ProtectedRoute = ({ allowedRoles }) => {
  const { isLoggedIn, role, authChecked } = useAuthStore();

  // 1. If we are still waiting for the initial auth check to complete, show a loading screen.
  // This is the most important part of the fix.
  if (!authChecked) {
    return <LoadingScreen />;
  }

  // 2. Once the check is done, if the user is not logged in, redirect them.
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 3. If the route requires specific roles and the user doesn't have one, redirect.
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. If all checks pass, render the protected content.
  return <Outlet />;
};

export default ProtectedRoute;