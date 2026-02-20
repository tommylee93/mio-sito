# Ristruttura Market - Demo

Demo full-stack per mettere in contatto:
- utenti che richiedono preventivi di ristrutturazione
- aziende che propongono offerte in un mercato libero

Frontend: React + Vite
Backend locale: Python + FastAPI

## Pagine front-end

- `/#/` Mercato: lista richieste con numero offerte e miglior prezzo
- `/#/richiedi` Richiedi preventivo (utente)
- `/#/aziende` Inserisci preventivo (azienda)

## Avvio demo completo (Windows)

Dalla root progetto:

```powershell
cd C:\Users\User\Desktop\mio-sito
.\run-demo.ps1
```

Lo script:
- crea (se serve) `backend/.venv`
- installa dipendenze backend
- avvia FastAPI su `http://127.0.0.1:8000`
- avvia frontend Vite

## Avvio manuale

Backend:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

Frontend (in un altro terminale):

```powershell
cd C:\Users\User\Desktop\mio-sito
npm.cmd install
npm.cmd run dev
```

## Deploy front-end su GitHub Pages

Il backend e locale e non va pubblicato.

```powershell
npm.cmd run deploy
```

## Nota Git

La cartella `backend/` e ignorata in `.gitignore`, quindi su GitHub finiscono solo file front-end (piu file di supporto progetto).
