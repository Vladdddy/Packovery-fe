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
            <div className="img-cont animate-slide-right">
                <img src={Logo} alt="Packovery Logo" />
            </div>
            <div className="login-form insert-email animate-slide-right">
                <form onSubmit={handleSubmit}>
                    <h1 className="animate-slide-right-delay-1">
                        Inserisci la tua email
                    </h1>
                    <h2 className="animate-slide-right-delay-2">
                        Inserisci l'email del tuo account. Ti invieremo un
                        codice per modificare la tua password.
                    </h2>
                    <div className="row animate-slide-right-delay-3">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required />
                    </div>
                    <div className="buttons animate-slide-right-delay-4">
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
