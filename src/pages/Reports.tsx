import "../styles/reports.css";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

function Reports() {
    return (
        <section className="layout reports-page">
            <Sidebar currentPage="reports" />
            <div className="page-content">
                <Topbar header="Segnalazioni Attive" btn={null} />
                <div className="reports-page"></div>
            </div>
        </section>
    );
}

export default Reports;
