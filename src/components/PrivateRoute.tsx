import { Navigate, Outlet } from "react-router-dom";
import { authService } from "../services/authService";

const PrivateRoute = () => {
  const isAuthenticated = authService.isAuthenticated();
  const isCustomerCare = authService.hasRole("CUSTOMER_CARE");

  console.log("PrivateRoute Check:", { isAuthenticated, isCustomerCare });

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (!isCustomerCare) {
    console.log("User does not have CUSTOMER_CARE role, redirecting to login");
    // If the user has a valid token but not the right role, logout and redirect to login
    authService.logout();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
