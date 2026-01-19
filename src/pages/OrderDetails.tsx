import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useNavigate } from "react-router-dom";
import "../styles/orders.css";

function OrderDetails() {
  const navigate = useNavigate();

  return (
    <section className="layout">
      <Sidebar currentPage="orders" />
      <div className="page-content">
        <Topbar header="ID Ordine: A100D" btn={null} />
        <div className="alerts-page"></div>
      </div>
    </section>
  );
}

export default OrderDetails;
