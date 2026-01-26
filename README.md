# Packovery Frontend

Applicazione frontend per il sistema di gestione logistica e tracciamento Packovery. Sviluppata con React, TypeScript e Vite.

## 🚀 Stack Tecnologico

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Linguaggio**: [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Mappe**: [Leaflet](https://leafletjs.com/) & [React Leaflet](https://react-leaflet.js.org/)
- **Autenticazione**: JWT (JSON Web Tokens)

## 🛠️ Prerequisiti

- **Node.js** (È raccomandata l'ultima versione LTS)
- **pnpm** (Gestore di pacchetti utilizzato in questo progetto)

## 📦 Installazione

1. Naviga nella directory del progetto:

   ```bash
   cd Packovery-fe
   ```

2. Installa le dipendenze:
   ```bash
   pnpm install
   ```

## ▶️ Avvio dell'Applicazione

### Modalità Sviluppo

Per avviare il server di sviluppo con Hot Module Replacement (HMR):

```bash
pnpm dev
```

L'applicazione sarà disponibile su `http://localhost:5173`.

> **Nota:** Il server di sviluppo è configurato per inoltrare (proxy) le richieste API al backend su `http://localhost:8080`. Assicurati che il servizio backend sia in esecuzione.

### Build di Produzione

Per compilare l'applicazione per la produzione:

```bash
pnpm build
```

Per vedere un'anteprima della build di produzione localmente:

```bash
pnpm preview
```

## 📂 Struttura del Progetto

```
src/
├── assets/          # Risorse statiche (icone, immagini)
├── components/      # Componenti UI riutilizzabili
├── functions/       # Funzioni di utilità condivise
├── layout/          # Componenti di layout (Sidebar, Topbar)
├── pages/           # Viste/rotte dell'applicazione
├── services/        # Servizi di comunicazione API
├── styles/          # Fogli di stile CSS
├── App.tsx          # Componente principale dell'applicazione
└── main.tsx         # Punto di ingresso (Entry point)
```

## ⚙️ Configurazione

### Variabili d'Ambiente

L'applicazione utilizza variabili d'ambiente per la configurazione. Puoi creare un file `.env` nella directory principale.

- `VITE_API_BASE_URL`: URL base per l'API (il default è vuoto, affidandosi al proxy).

### Configurazione Proxy (`vite.config.ts`)

Il server di sviluppo Vite è configurato per inoltrare le richieste al backend:

- `/api` -> `http://localhost:8080`
- `/alert-rules` -> `http://localhost:8080`
- `/alert-issues` -> `http://localhost:8080`
- `/communications` -> `http://localhost:8080`

## 🔑 Autenticazione

L'applicazione utilizza JWT per l'autenticazione. I token sono salvati nel `localStorage`:

- `accessToken`: Utilizzato per le richieste autenticate.
- `refreshToken`: Utilizzato per aggiornare la sessione quando l'access token scade.

## 🤝 Contribuire

1. Assicurati che il codice sia formattato ed esegui il linting prima di fare un commit.
2. Esegui `pnpm lint` per controllare eventuali problemi di qualità del codice.
