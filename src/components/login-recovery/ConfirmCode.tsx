import { useState, useRef } from "react";
import Logo from "../../../public/packovery-full-logo.png";
import "../../styles/login.css";
import {
  handleInputChange,
  handleKeyDown,
} from "../../functions/LoginFunctions";

interface ConfirmCodeProps {
  onSubmit: (code: string) => void;
}

function ConfirmCode({ onSubmit }: ConfirmCodeProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const code = inputRefs.current.map((input) => input?.value || "").join("");

    if (code.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    onSubmit(code);
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
            <button type="button" className="secondary-btn">
              Annulla
            </button>
            <button type="submit">Conferma</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConfirmCode;
