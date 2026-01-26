import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../public/packovery-full-logo.png";
import "../../styles/login.css";
import {
  handleInputChange,
  handleKeyDown,
} from "../../functions/LoginFunctions";
import { authService } from "../../services/authService";

interface ConfirmCodeProps {
  email: string;
  onSubmit: (code: string) => void;
  onBack?: () => void;
}

function ConfirmCode({ email, onSubmit, onBack }: ConfirmCodeProps) {
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const code = inputRefs.current.map((input) => input?.value || "").join("");

    if (code.length !== 6) {
      setError("Inserisci tutte le 6 cifre");
      return;
    }

    setLoading(true);

    try {
      // Verify OTP with backend
      await authService.verifyOtp({ email, otp: code });
      // If successful, proceed to next step
      onSubmit(code);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Codice non valido. Riprova.",
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
      <div className="login-form insert-email confirm-code animate-slide-right">
        <form onSubmit={handleSubmit}>
          <h1 className="animate-slide-right-delay-1">Codice di conferma</h1>
          <h2 className="animate-slide-right-delay-2">
            Inserisci il codice a 6 cifre che ti abbiamo inviato per email.
          </h2>
          {error && (
            <div className="error-message animate-fade-in">{error}</div>
          )}
          <div className="row animate-slide-right-delay-3">
            <div className="numbers">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  type="number"
                  maxLength={1}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  onChange={(e) => handleInputChange(index, e, inputRefs)}
                  onKeyDown={(e) => handleKeyDown(index, e, inputRefs)}
                  required
                />
              ))}
            </div>
          </div>
          <div className="buttons animate-slide-right-delay-4">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/login")}
              disabled={loading}
            >
              Annulla
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Verifica..." : "Conferma"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConfirmCode;
