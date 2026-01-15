import Logo from "../../../public/packovery-full-logo.png";
import "../../styles/login.css";
import { useRef } from "react";

interface ConfirmCodeProps {
  onSubmit: () => void;
}

function ConfirmCode({ onSubmit }: ConfirmCodeProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const handleInputChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    // Only allow single digit
    if (value.length > 1) {
      e.target.value = value.slice(0, 1);
    }

    // Move to next input if value is entered
    if (value.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div>
      <div className="img-cont">
        <img src={Logo} alt="Packovery Logo" />
      </div>
      <div className="login-form insert-email confirm-code">
        <form onSubmit={handleSubmit}>
          <h1>Codice di conferma</h1>
          <h2>
            Inserisci il codice a 6 cifre che ti abbiamo inviato per email.
          </h2>
          <div className="row">
            <div className="numbers">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  type="number"
                  maxLength={1}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  onChange={(e) => handleInputChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  required
                />
              ))}
            </div>
          </div>
          <div className="buttons">
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
