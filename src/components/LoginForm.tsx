import { useState } from "react";
import Logo from "../../public/packovery-full-logo.png";
import View from "../assets/icons/view";
import Hide from "../assets/icons/hide";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onClickPass = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/recovery");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.login({ email, password });
      navigate("/orders");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="img-cont animate-fade-in">
        <img src={Logo} alt="Packovery Logo" />
      </div>
      <div className="login-form animate-slide-up">
        <form onSubmit={handleSubmit}>
          <h1 className="animate-fade-in-delay-1">Accedi</h1>

          <div className="row animate-fade-in-delay-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="row password-field animate-fade-in-delay-3">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <Hide width={20} height={20} />
                ) : (
                  <View width={20} height={20} />
                )}
              </button>
            </div>
          </div>
          <p onClick={onClickPass} className="animate-fade-in-delay-4">
            Password dimenticata?
          </p>
          <button
            type="submit"
            className="animate-fade-in-delay-5"
            disabled={loading}
          >
            {loading ? "Accesso in corso..." : "Accedi"}
          </button>
          {error && (
            <div className="error-message animate-fade-in">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
