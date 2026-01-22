import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import "../styles/alerts.css";
import Topbar from "../components/layout/Topbar";
import AlertsTable from "../components/AlertsTable";

export default function Alerts() {
  const navigate = useNavigate();

  return (
    <section className="layout">
      <Sidebar currentPage="alerts" />
      <div className="page-content">
        <Topbar
          header="Configuratore Alert"
          btn="Crea Alert"
          onClick={() => navigate("/alerts/create")}
        />
        <div className="alerts-page">
          <button
            className="btn btn-mobile"
            onClick={() => navigate("/alerts/create")}
          >
            Crea Alert
          </button>
          <AlertsTable />
        </div>
      </div>
    </section>
  );
}
