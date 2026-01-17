import "../styles/orders.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function Orders() {
    return (
        <section className="layout">
            <Sidebar currentPage="orders" />
            <div className="page-content">
                <Topbar header="Ricerca Ordine" btn="Cerca Ordine" />
                <div className="orders-page"></div>
            </div>
        </section>
    );
}

export default Orders;
