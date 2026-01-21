import Sidebar from "../components/layout/Sidebar";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/layout/Topbar";

function SearchOrder() {
  const navigate = useNavigate();
  return (
    <section className="layout">
      <Sidebar currentPage="orders" />
      <div className="page-content">
        <Topbar
          header="Cerca Ordine"
          btn="Cerca Ordine"
          onClick={() => navigate("/search-order")}
        />
        <div className="alerts-page"></div>
      </div>
    </section>
  );
}

export default SearchOrder;
