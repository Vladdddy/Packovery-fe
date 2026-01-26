import "../../styles/sidebar.css";
import Logo from "../../../public/packovery-full-logo.png";
import { Link, useNavigate } from "react-router-dom";
import OrdersIcon from "../../assets/icons/orders.tsx";
import LogoutIcon from "../../assets/icons/logout.tsx";
import WarningIcon from "../../assets/icons/warning.tsx";
import AlertIcon from "../../assets/icons/alert.tsx";
import MenuIcon from "../../assets/icons/menu.tsx";
import CloseIcon from "../../assets/icons/close.tsx";
import { useState } from "react";
import { authService } from "../../services/authService";

function Sidebar({ currentPage }: { currentPage: string }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleLogout = () => {
        authService.logout();
        closeMobileMenu();
        navigate("/login");
    };

    return (
        <>
            {isMobileMenuOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={closeMobileMenu}
                ></div>
            )}

            <div className={`sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
                <button className="burger-menu-btn" onClick={toggleMobileMenu}>
                    {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
                <img src={Logo} alt="Packovery Logo" />
                <div className="sidebar-content">
                    <h4>MENU</h4>
                    <Link
                        to="/"
                        className={currentPage === "orders" ? "active" : ""}
                        onClick={closeMobileMenu}
                    >
                        <OrdersIcon /> Ricerca Ordine
                    </Link>
                    <Link
                        to="/reports"
                        className={currentPage === "reports" ? "active" : ""}
                        onClick={closeMobileMenu}
                    >
                        <WarningIcon />
                        Segnalazioni Attive
                    </Link>
                    <Link
                        to="/alerts"
                        className={currentPage === "alerts" ? "active" : ""}
                        onClick={closeMobileMenu}
                    >
                        <AlertIcon /> Configuratore Alert
                    </Link>
                </div>
                <button className="logout-link" onClick={handleLogout}>
                    <LogoutIcon /> <p>Esci</p>
                </button>
            </div>
        </>
    );
}

export default Sidebar;
