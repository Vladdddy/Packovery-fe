import { useEffect, useState } from "react";
import IssueItem from "./IssueItem";
import IssueResolverDialog from "./IssueResolverDialog";
import { alertIssuesService } from "../services/alertIssuesService";
import type { Issue } from "../services/alertIssuesService";
import "../styles/reports.css";

export default function IssueList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const list = await alertIssuesService.getOpen();
        setIssues(list);
      } catch (e) {
        console.error(e);
        alert((e as Error).message || "Impossibile caricare segnalazioni");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openResolver = (id: string) => {
    setSelectedId(id);
    setDialogOpen(true);
  };

  const handleResolve = async (notes: string) => {
    if (!selectedId) return;
    await alertIssuesService.resolveIssue(selectedId, { notes });
    // Refresh list
    const list = await alertIssuesService.getOpen();
    setIssues(list);
  };

  return (
    <div className="reports-page-content">
      <div className="list">
        {loading && <p>Caricamento...</p>}
        {!loading && issues.length === 0 && <p>Nessuna segnalazione aperta</p>}
        {issues.map((it) => (
          <IssueItem
            key={it.id}
            id={it.id}
            orderId={it.orderId}
            alertName={it.alertName}
            time={it.createdAt}
            onResolve={openResolver}
          />
        ))}
      </div>

      <IssueResolverDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onResolve={handleResolve}
      />
    </div>
  );
}
