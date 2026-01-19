import "../styles/orders.css";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import OrdersTable from "../components/OrdersTable";
import { useNavigate } from "react-router-dom";

function Orders() {
  const navigate = useNavigate();

  return (
    <section className="layout">
      <Sidebar currentPage="orders" />
      <div className="page-content">
        <Topbar
          header="Ricerca Ordine"
          btn="Cerca Ordine"
          onClick={() => navigate("/search-order")}
        />
        <div className="orders-page">
          <button
            className="btn btn-mobile"
            onClick={() => navigate("/search-order")}
          >
            Cerca Ordine
          </button>
          <OrdersTable />
        </div>
      </div>
    </section>
  );
}

export default Orders;
