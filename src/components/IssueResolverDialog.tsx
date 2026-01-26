import { useState, useEffect } from "react";

interface Props {
    open: boolean;
    onClose: () => void;
    onResolve: (notes: string) => Promise<void>;
}

export default function IssueResolverDialog({
    open,
    onClose,
    onResolve,
}: Props) {
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="pv-modal-backdrop"
            role="presentation"
            onClick={onClose}
        >
            <div
                className="pv-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Risolvi segnalazione"
                onClick={(e) => e.stopPropagation()}
            >
                <h3>Risolvi Segnalazione</h3>
                <label className="pv-label">Note</label>
                <textarea
                    className="pv-textarea"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />

                <div className="modal-actions">
                    <button
                        className="back-btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Annulla
                    </button>
                    <button
                        className="confirm-btn"
                        onClick={async () => {
                            setLoading(true);
                            try {
                                await onResolve(notes);
                                setNotes("");
                                onClose();
                            } catch (e) {
                                alert(
                                    (e as Error).message ||
                                        "Errore durante la risoluzione",
                                );
                            } finally {
                                setLoading(false);
                            }
                        }}
                        disabled={loading}
                    >
                        {loading ? "..." : "Conferma"}
                    </button>
                </div>
            </div>
        </div>
    );
}
