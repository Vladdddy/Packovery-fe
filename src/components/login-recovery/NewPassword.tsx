import { useState } from "react";
import Logo from "../../../public/packovery-full-logo.png";
import "../../styles/login.css";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

interface NewPasswordProps {
  email: string;
  code: string;
}

function NewPassword({ email, code }: NewPasswordProps) {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Le password non corrispondono");
      return;
    }

    if (password.length < 8) {
      setError("La password deve essere di almeno 8 caratteri");
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword({
        email,
        code,
        newPassword: password,
      });
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="img-cont animate-slide-right">
        <img src={Logo} alt="Packovery Logo" />
      </div>
      <div className="login-form insert-email animate-slide-right">
        <form onSubmit={handleSubmit}>
          <h1 className="animate-slide-right-delay-1">Nuova Password</h1>
          <h2 className="animate-slide-right-delay-2">
            Crea la tua nuova password.
          </h2>
          {error && (
            <div className="error-message animate-fade-in">{error}</div>
          )}
          <div className="row animate-slide-right-delay-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="row animate-slide-right-delay-4">
            <label htmlFor="confirmPassword">Conferma Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="buttons animate-slide-right-delay-5">
            <button type="button" className="secondary-btn">
              Annulla
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Creazione..." : "Crea Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewPassword;
