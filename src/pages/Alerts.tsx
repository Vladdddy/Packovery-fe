
import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import "../styles/alerts.css";

type AlertItem = {
    id: string;
    name: string;
    created: string;
    type: string;
    threshold: string;
    state: "Attivo" | "Non attivo";
};

const sample: AlertItem[] = [
    { id: "A0001", name: "Alert1", created: "18/12/2025", type: "Ritardo consegna ordine", threshold: "01:00", state: "Attivo" },
    { id: "A0002", name: "Alert2", created: "22/12/2025", type: "Ritardo partenza ordine", threshold: "02:00", state: "Non attivo" },
    { id: "A0003", name: "Alert3", created: "06/01/2026", type: "Segnale GPS interrotto", threshold: "00:30", state: "Attivo" }
];

export default function Alerts() {
    const navigate = useNavigate();

    return (
        <div className="pv-page">
            <Sidebar />
            <main className="pv-main">
                <div className="pv-main-header">
                    <h1>Configuratore alert</h1>
                        <button className="frame-btn" onClick={() => navigate("/alerts/create")}> 
                        <span className="btn-label">Crea alert</span>
                        <span className="btn-icon">
                            <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.0001 4.16675V15.8334M4.16675 10.0001H15.8334" stroke="var(--black)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </span>
                    </button>
                </div>

                <div className="tabella-mezzi">
                    <div className="intestazione-tabella">
                        <div className="intestazione-col w-72">Nome</div>
                        <div className="intestazione-col w-72">Data creazione</div>
                        <div className="intestazione-col w-80">Tipologia</div>
                        <div className="intestazione-col w-44">Soglia</div>
                        <div className="intestazione-col w-56">Stato</div>
                        <div className="intestazione-col actions-col" />
                    </div>
                    {sample.map((a, i) => (
                        <div className={`righe-tabella${i === sample.length-1 ? ' righe-tabella-last' : ''}`} key={a.id}>
                            <div className="righe-frame flex">
                                <div className="nome-campo w-72">{a.name}</div>
                                <div className="nome-campo w-72">{a.created}</div>
                                <div className="nome-campo w-80">{a.type}</div>
                                <div className="nome-campo w-44">{a.threshold}</div>
                                <div className="nome-campo w-56">{a.state}</div>
                            </div>
                            <div className="icons flex">
                                <button className="icon-btn" title="Toggle">
                                    {a.state === "Attivo" ? (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14 12C14 12.5304 14.2107 13.0391 14.5858 13.4142C14.9609 13.7893 15.4696 14 16 14C16.5304 14 17.0391 13.7893 17.4142 13.4142C17.7893 13.0391 18 12.5304 18 12C18 11.4696 17.7893 10.9609 17.4142 10.5858C17.0391 10.2107 16.5304 10 16 10C15.4696 10 14.9609 10.2107 14.5858 10.5858C14.2107 10.9609 14 11.4696 14 12Z" stroke="var(--black)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M2 12C2 10.4087 2.63214 8.88258 3.75736 7.75736C4.88258 6.63214 6.4087 6 8 6H16C17.5913 6 19.1174 6.63214 20.2426 7.75736C21.3679 8.88258 22 10.4087 22 12C22 13.5913 21.3679 15.1174 20.2426 16.2426C19.1174 17.3679 17.5913 18 16 18H8C6.4087 18 4.88258 17.3679 3.75736 16.2426C2.63214 15.1174 2 13.5913 2 12Z" stroke="var(--black)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    ) : (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 12C6 12.5304 6.21071 13.0391 6.58579 13.4142C6.96086 13.7893 7.46957 14 8 14C8.53043 14 9.03914 13.7893 9.41421 13.4142C9.78929 13.0391 10 12.5304 10 12C10 11.4696 9.78929 10.9609 9.41421 10.5858C9.03914 10.2107 8.53043 10 8 10C7.46957 10 6.96086 10.2107 6.58579 10.5858C6.21071 10.9609 6 11.4696 6 12Z" stroke="var(--black)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M2 12C2 10.4087 2.63214 8.88258 3.75736 7.75736C4.88258 6.63214 6.4087 6 8 6H16C17.5913 6 19.1174 6.63214 20.2426 7.75736C21.3679 8.88258 22 10.4087 22 12C22 13.5913 21.3679 15.1174 20.2426 16.2426C19.1174 17.3679 17.5913 18 16 18H8C6.4087 18 4.88258 17.3679 3.75736 16.2426C2.63214 15.1174 2 13.5913 2 12Z" stroke="var(--black)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    )}
                                </button>
                                <button className="icon-btn" title="Edit" onClick={() => navigate(`/alerts/${a.id}/edit`)}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 7H6C5.46957 7 4.96086 7.21071 4.58579 7.58579C4.21071 7.96086 4 8.46957 4 9V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H15C15.5304 20 16.0391 19.7893 16.4142 19.4142C16.7893 19.0391 17 18.5304 17 18V17M16 5L19 8M20.385 6.58511C20.7788 6.19126 21.0001 5.65709 21.0001 5.10011C21.0001 4.54312 20.7788 4.00895 20.385 3.61511C19.9912 3.22126 19.457 3 18.9 3C18.343 3 17.8088 3.22126 17.415 3.61511L9 12.0001V15.0001H12L20.385 6.58511Z" stroke="var(--black)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                                <button className="icon-btn" title="Delete">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 7H20M10 11V17M14 11V17M5 7L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 7M9 7V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7" stroke="var(--black)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
