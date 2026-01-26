import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onResolve: (notes: string) => Promise<void>;
}

export default function IssueResolverDialog({ open, onClose, onResolve }: Props) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  return (
    <div className="pv-modal-backdrop">
      <div className="pv-modal">
        <h3>Risolvi Segnalazione</h3>
        <label className="pv-label">Note</label>
        <textarea className="pv-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} />

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
          <button className="secondary-btn" onClick={onClose} disabled={loading}>
            Annulla
          </button>
          <button
            className="btn"
            onClick={async () => {
              setLoading(true);
              try {
                await onResolve(notes);
                setNotes("");
                onClose();
              } catch (e) {
                alert((e as Error).message || "Errore durante la risoluzione");
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            {loading ? "..." : "Conferma risoluzione"}
          </button>
        </div>
      </div>
    </div>
  );
}
