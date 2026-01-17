import "../styles/orders.css";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import OrdersTable from "../components/OrdersTable";

function Orders() {
    return (
        <section className="layout">
            <Sidebar currentPage="orders" />
            <div className="page-content">
                <Topbar header="Ricerca Ordine" btn="Cerca Ordine" />
                <div className="orders-page">
                    <OrdersTable />
                </div>
            </div>
        </section>
    );
}

export default Orders;
