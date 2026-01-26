import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { authService } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isAuthenticated() && authService.hasRole("CUSTOMER_CARE")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <section>
      <LoginForm />
    </section>
  );
}

export default Login;
