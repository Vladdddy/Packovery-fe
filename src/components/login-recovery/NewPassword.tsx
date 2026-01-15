import Logo from "../../../public/packovery-full-logo.png";
import "../../styles/login.css";
import { useNavigate } from "react-router-dom";

function NewPassword() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div>
      <div className="img-cont">
        <img src={Logo} alt="Packovery Logo" />
      </div>
      <div className="login-form insert-email">
        <form onSubmit={handleSubmit}>
          <h1>Nuova Password</h1>
          <h2>Crea la tua nuova password.</h2>
          <div className="row">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <div className="row">
            <label htmlFor="password">Conferma Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <div className="buttons">
            <button type="button" className="secondary-btn">
              Annulla
            </button>
            <button type="submit">Crea Password</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewPassword;
