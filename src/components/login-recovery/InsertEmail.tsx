import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../public/packovery-full-logo.png";
import "../../styles/login.css";
import { authService } from "../../services/authService";

interface InsertEmailProps {
  onSubmit: (email: string) => void;
}

function InsertEmail({ onSubmit }: InsertEmailProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.requestPasswordReset(email);
      onSubmit(email);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send reset code.",
      );
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
          <h1 className="animate-slide-right-delay-1">
            Inserisci la tua email
          </h1>
          <h2 className="animate-slide-right-delay-2">
            Inserisci l'email del tuo account. Ti invieremo un codice per
            modificare la tua password.
          </h2>
          {error && (
            <div className="error-message animate-fade-in">{error}</div>
          )}
          <div className="row animate-slide-right-delay-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="buttons animate-slide-right-delay-4">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/login")}
            >
              Annulla
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Invio..." : "Invia codice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InsertEmail;
