import "../../styles/sidebar.css";
import Logo from "../../../public/packovery-full-logo.png";
import { Link } from "react-router-dom";
import OrdersIcon from "../../assets/icons/orders.tsx";
import LogoutIcon from "../../assets/icons/logout.tsx";
import WarningIcon from "../../assets/icons/warning.tsx";
import AlertIcon from "../../assets/icons/alert.tsx";

function Sidebar({ currentPage }: { currentPage: string }) {
    return (
        <div className="sidebar">
            <img src={Logo} alt="Packovery Logo" />
            <div className="sidebar-content">
                <h4>MENU</h4>
                <Link
                    to="/"
                    className={currentPage === "orders" ? "active" : ""}
                >
                    <OrdersIcon /> Ricerca Ordine
                </Link>
                <Link
                    to="/reports"
                    className={currentPage === "reports" ? "active" : ""}
                >
                    <WarningIcon />
                    Segnalazioni Attive
                </Link>
                <Link
                    to="/alerts"
                    className={currentPage === "alerts" ? "active" : ""}
                >
                    <AlertIcon /> Configuratore Alert
                </Link>
            </div>
            <Link to="/login" className="logout-link">
                <LogoutIcon /> Esci
            </Link>
        </div>
    );
}

export default Sidebar;
