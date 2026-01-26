import "../styles/orders.css";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import OrdersTable from "../components/OrdersTable";
import { useNavigate, useLocation } from "react-router-dom";

function Orders() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchedOrders = location.state?.searchedOrders;

    const handleClearFilter = () => {
        // Navigate to /orders without state to clear the filter
        navigate("/orders", { replace: true });
    };

    return (
        <section className="layout">
            <Sidebar currentPage="orders" />
            <div className="page-content">
                <Topbar
                    header="Ricerca Ordine"
                    btn={searchedOrders ? "Cancella filtro" : "Cerca Ordine"}
                    onClick={() =>
                        searchedOrders
                            ? handleClearFilter()
                            : navigate("/search-order")
                    }
                    btnClassName={searchedOrders ? "btn-danger" : ""}
                />
                <div className="orders-page">
                    {searchedOrders ? (
                        <button
                            className="btn btn-mobile btn-danger"
                            onClick={handleClearFilter}
                        >
                            Cancella filtro
                        </button>
                    ) : (
                        <button
                            className="btn btn-mobile"
                            onClick={() => navigate("/search-order")}
                        >
                            Cerca Ordine
                        </button>
                    )}
                    <OrdersTable searchedOrders={searchedOrders} />
                </div>
            </div>
        </section>
    );
}

export default Orders;
