import "../styles/alerts.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "../assets/icons/edit.tsx";
import DeleteIcon from "../assets/icons/bin.tsx";
import { alertsService } from "../services/alertsService";

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
    const [hasAnimated, setHasAnimated] = useState(false);
    const totalPages = 2;
    const [alerts, setAlerts] = useState<Alerts[]>([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasAnimated(true);
    }, []);

    useEffect(() => {
        loadAlerts();
    }, []);

    async function loadAlerts() {
        setLoading(true);
        try {
            const list = await alertsService.listAlerts();
            // map API shape to local shape
            const mapped = list.map((a, idx) => ({
                id: a.id,
                name: a.name,
                created: a.created || "",
                type: a.type,
                threshold: a.threshold,
                state: a.active ? "Attivo" : "Non attivo",
            }));
            setAlerts(mapped);
        } catch (e) {
            console.error(e);
            // keep fallback empty
        } finally {
            setLoading(false);
        }
    }

    const toggleAlertState = (alertId: string) => {
        (async () => {
            const target = alerts.find((a) => a.id === alertId);
            if (!target) return;
            const newActive = target.state !== "Attivo";
            try {
                await alertsService.updateAlert(alertId, { active: newActive });
                setAlerts((prev) =>
                    prev.map((alert) =>
                        alert.id === alertId
                            ? { ...alert, state: newActive ? "Attivo" : "Non attivo" }
                            : alert,
                    ),
                );
            } catch (e) {
                console.error(e);
                alert("Impossibile aggiornare lo stato dell'alert");
            }
        })();
    };

    const handleDelete = (alertId: string) => {
        (async () => {
            if (!confirm("Confermi cancellazione alert?")) return;
            try {
                await alertsService.deleteAlert(alertId);
                setAlerts((prev) => prev.filter((a) => a.id !== alertId));
            } catch (e) {
                console.error(e);
                alert("Errore durante la cancellazione");
            }
        })();
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
        {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            `alerts-table-container ${hasAnimated ? "animate-in" : ""}`;
        }
        return pages;
    };

    return (
        <div
            className={`alerts-table-container ${hasAnimated ? "animate-in" : ""}`}
        >
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
                        {loading ? (
                            <tr>
                                <td colSpan={6}>Caricamento...</td>
                            </tr>
                        ) : alerts.map((a, index) => (
                            <tr
                                key={a.id}
                                className={hasAnimated ? "animate-row" : ""}
                                style={
                                    hasAnimated
                                        ? { animationDelay: `${index * 0.1}s` }
                                        : {}
                                }
                            >
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
                                                        onChange={() => toggleAlertState(a.id)}
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
                                            onClick={() => handleDelete(a.id)}
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
