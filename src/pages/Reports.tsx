import "../styles/reports.css";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import ReportRender from "../components/ReportRender";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { authService } from "../services/authService";

function Reports() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate("/login");
        }
    }, [navigate]);
    return (
        <section className="layout reports-page">
            <Sidebar currentPage="reports" />
            <div className="page-content">
                <Topbar header="Segnalazioni Ricevute" btn={null} />
                <div className="reports-page-content">
                    <div className="list">
                        <ReportRender />
                        <ReportRender />
                        <ReportRender />
                        <ReportRender />
                        <ReportRender />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Reports;
