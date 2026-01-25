import { useState, useEffect } from "react";
import "../styles/orders.css";
import InfoIcon from "../assets/icons/info.tsx";
import { ordersService } from "../services/ordersService.ts";

interface Order {
    id: string;
    stato: string;
    partenza: string;
    destinazione: string;
    data: string;
    peso: string;
    dimensione: string;
}

function OrdersTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [hasAnimated, setHasAnimated] = useState(false);
    const totalPages = 10;

    const getOrders = async () => {
        try {
            const data = await ordersService.fetchOrders();
            if (data) {
                console.log("Fetched orders:", data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    // Sample data matching the image
    const orders: Order[] = [
        {
            id: "AB1234",
            stato: "In transito",
            partenza: "Legnano MI",
            destinazione: "Varese VA",
            data: "12/01/2026",
            peso: "M (1kg - 3kg)",
            dimensione: "M (16cm - 30cm)",
        },
        {
            id: "CD5678",
            stato: "In transito",
            partenza: "Busto Arsizio VA",
            destinazione: "Cislago VA",
            data: "13/01/2026",
            peso: "L (3kg - 5kg)",
            dimensione: "L (31cm - 45cm)",
        },
        {
            id: "EF9012",
            stato: "In attesa",
            partenza: "Varese VA",
            destinazione: "Tradate VA",
            data: "21/12/2025",
            peso: "S (1g - 90g)",
            dimensione: "S (1cm - 15cm)",
        },
        {
            id: "GH3456",
            stato: "In transito",
            partenza: "Saronno VA",
            destinazione: "Como CO",
            data: "13/01/2026",
            peso: "XL (6kg - 10kg)",
            dimensione: "M (16cm - 30cm)",
        },
        {
            id: "GH3456",
            stato: "In transito",
            partenza: "Saronno VA",
            destinazione: "Como CO",
            data: "13/01/2026",
            peso: "XL (6kg - 10kg)",
            dimensione: "M (16cm - 30cm)",
        },
        {
            id: "GH3456",
            stato: "In transito",
            partenza: "Saronno VA",
            destinazione: "Como CO",
            data: "13/01/2026",
            peso: "XL (6kg - 10kg)",
            dimensione: "M (16cm - 30cm)",
        },
        {
            id: "GH3456",
            stato: "In transito",
            partenza: "Saronno VA",
            destinazione: "Como CO",
            data: "13/01/2026",
            peso: "XL (6kg - 10kg)",
            dimensione: "M (16cm - 30cm)",
        },
        {
            id: "GH3456",
            stato: "In transito",
            partenza: "Saronno VA",
            destinazione: "Como CO",
            data: "13/01/2026",
            peso: "XL (6kg - 10kg)",
            dimensione: "M (16cm - 30cm)",
        },
        {
            id: "GH3456",
            stato: "In transito",
            partenza: "Saronno VA",
            destinazione: "Como CO",
            data: "13/01/2026",
            peso: "XL (6kg - 10kg)",
            dimensione: "M (16cm - 30cm)",
        },
        {
            id: "GH3456",
            stato: "In transito",
            partenza: "Saronno VA",
            destinazione: "Como CO",
            data: "13/01/2026",
            peso: "XL (6kg - 10kg)",
            dimensione: "M (16cm - 30cm)",
        },
    ];

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasAnimated(true);
        getOrders();
    }, []);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Generate dynamic page numbers based on current page
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (currentPage <= 3) {
            // Show first 3 pages
            for (let i = 1; i <= Math.min(3, totalPages); i++) {
                pages.push(i);
            }
            if (totalPages > 4) {
                pages.push("...");
            }
            if (totalPages > 3) {
                pages.push(totalPages);
            }
        } else if (currentPage >= totalPages - 2) {
            // Show last 3 pages
            for (let i = Math.max(totalPages - 2, 1); i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show current page and neighbors (sliding window)
            pages.push(currentPage - 1);
            pages.push(currentPage);
            pages.push(currentPage + 1);
            pages.push("...");
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div
            className={`orders-table-container ${hasAnimated ? "animate-in" : ""}`}
        >
            <div className="orders-table-wrapper">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Stato</th>
                            <th>Partenza</th>
                            <th>Destinazione</th>
                            <th>Data</th>
                            <th>Peso</th>
                            <th>Dimensione</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr
                                key={order.id}
                                className={hasAnimated ? "animate-row" : ""}
                                style={
                                    hasAnimated
                                        ? { animationDelay: `${index * 0.1}s` }
                                        : {}
                                }
                            >
                                <td>{order.id}</td>
                                <td>
                                    <span
                                        className={`status ${order.stato.toLowerCase().replace(" ", "-")}`}
                                    >
                                        {order.stato}
                                    </span>
                                </td>
                                <td>{order.partenza}</td>
                                <td>{order.destinazione}</td>
                                <td>{order.data}</td>
                                <td>{order.peso}</td>
                                <td>{order.dimensione}</td>
                                <td>
                                    <button className="detail-button">
                                        <InfoIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    ‹
                </button>
                {getPageNumbers().map((page, index) =>
                    typeof page === "number" ? (
                        <button
                            key={page}
                            className={`pagination-button ${currentPage === page ? "active" : ""}`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={`dots-${index}`} className="pagination-dots">
                            {page}
                        </span>
                    ),
                )}
                <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    ›
                </button>
            </div>
        </div>
    );
}

export default OrdersTable;
