import Logo from "../../../public/packovery-full-logo.png";
import "../../styles/login.css";

interface InsertEmailProps {
  onSubmit: () => void;
}

function InsertEmail({ onSubmit }: InsertEmailProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div>
      <div className="img-cont">
        <img src={Logo} alt="Packovery Logo" />
      </div>
      <div className="login-form insert-email">
        <form onSubmit={handleSubmit}>
          <h1>Inserisci la tua email</h1>
          <h2>
            Inserisci l'email del tuo account. Ti invieremo un codice per
            modificare la tua password.
          </h2>
          <div className="row">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="buttons">
            <button type="button" className="secondary-btn">
              Annulla
            </button>
            <button type="submit">Invia codice</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InsertEmail;
