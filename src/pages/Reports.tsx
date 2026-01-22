import "../styles/reports.css";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import ReportRender from "../components/ReportRender";

function Reports() {
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
