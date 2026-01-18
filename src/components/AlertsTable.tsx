import "../styles/alerts.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "../assets/icons/edit.tsx";
import DeleteIcon from "../assets/icons/bin.tsx";

interface Alerts {
    id: string;
    name: string;
    created: string;
    type: string;
    threshold: string;
    state: "Attivo" | "Non attivo";
}

function AlertsTable() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 2;

    const [alerts, setAlerts] = useState<Alerts[]>([
        {
            id: "A0001",
            name: "Alert1",
            created: "18/12/2025",
            type: "Ritardo consegna ordine",
            threshold: "01:00",
            state: "Attivo",
        },
        {
            id: "A0002",
            name: "Alert2",
            created: "22/12/2025",
            type: "Ritardo partenza ordine",
            threshold: "02:00",
            state: "Non attivo",
        },
        {
            id: "A0003",
            name: "Alert3",
            created: "06/01/2026",
            type: "Segnale GPS interrotto",
            threshold: "00:30",
            state: "Attivo",
        },
    ]);

    const toggleAlertState = (alertId: string) => {
        setAlerts((prevAlerts) =>
            prevAlerts.map((alert) =>
                alert.id === alertId
                    ? {
                          ...alert,
                          state:
                              alert.state === "Attivo"
                                  ? "Non attivo"
                                  : "Attivo",
                      }
                    : alert,
            ),
        );
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

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
        <div className="alerts-table-container">
            <div className="alerts-table-wrapper">
                <table className="alerts-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Data creazione</th>
                            <th>Tipologia</th>
                            <th>Soglia</th>
                            <th>Stato</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {alerts.map((a) => (
                            <tr key={a.id}>
                                <td>{a.name}</td>
                                <td>{a.created}</td>
                                <td>{a.type}</td>
                                <td>{a.threshold}</td>
                                <td>{a.state}</td>
                                <td>
                                    <div className="icons">
                                        <button
                                            className="icon-btn toggle-btn"
                                            title="Toggle"
                                        >
                                            <div className="pv-toggle-row">
                                                <label className="pv-switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            a.state === "Attivo"
                                                        }
                                                        onChange={() =>
                                                            toggleAlertState(
                                                                a.id,
                                                            )
                                                        }
                                                    />
                                                    <span className="pv-slider" />
                                                </label>
                                            </div>
                                        </button>
                                        <button
                                            className="icon-btn"
                                            title="Edit"
                                            onClick={() =>
                                                navigate(`/alerts/${a.id}/edit`)
                                            }
                                        >
                                            <EditIcon />
                                        </button>
                                        <button
                                            className="icon-btn"
                                            title="Delete"
                                        >
                                            <DeleteIcon />
                                        </button>
                                    </div>
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

export default AlertsTable;
