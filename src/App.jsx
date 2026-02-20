import { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Errore HTTP ${response.status}`)
  }

  return response.json()
}

function MarketPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await apiFetch('/market')
        setItems(data)
        setError('')
      } catch {
        setError('Backend non raggiungibile. Avvia il server Python su 127.0.0.1:8000.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <section className="page">
      <h1>Mercato Preventivi</h1>
      <p className="hint">Confronto libero tra richieste dei clienti e offerte aziende.</p>

      {loading && <p>Caricamento...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="cards">
          {items.length === 0 && <p>Nessuna richiesta presente.</p>}
          {items.map((item) => (
            <article key={item.id} className="card">
              <h3>
                #{item.id} - {item.work_type}
              </h3>
              <p>
                <strong>Cliente:</strong> {item.customer_name} ({item.city})
              </p>
              <p>{item.description}</p>
              <p>
                <strong>Budget max:</strong> {item.budget_max} EUR
              </p>
              <p>
                <strong>Offerte ricevute:</strong> {item.quotes_count}
              </p>
              <p>
                <strong>Miglior prezzo:</strong>{' '}
                {item.best_price ? `${item.best_price} EUR` : 'Nessuna offerta'}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function RequestPage() {
  const [form, setForm] = useState({
    customer_name: '',
    city: '',
    work_type: '',
    description: '',
    budget_max: '',
  })
  const [message, setMessage] = useState('')

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    try {
      await apiFetch('/requests', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          budget_max: Number(form.budget_max),
        }),
      })
      setMessage('Richiesta inviata correttamente.')
      setForm({ customer_name: '', city: '', work_type: '', description: '', budget_max: '' })
    } catch {
      setMessage('Invio fallito. Verifica backend e campi compilati.')
    }
  }

  return (
    <section className="page">
      <h1>Richiedi Preventivo</h1>
      <form className="form" onSubmit={onSubmit}>
        <input name="customer_name" placeholder="Nome" value={form.customer_name} onChange={onChange} required />
        <input name="city" placeholder="Citta" value={form.city} onChange={onChange} required />
        <input name="work_type" placeholder="Tipo lavori" value={form.work_type} onChange={onChange} required />
        <textarea
          name="description"
          placeholder="Descrizione lavori"
          value={form.description}
          onChange={onChange}
          required
        />
        <input
          name="budget_max"
          type="number"
          min="1"
          placeholder="Budget massimo"
          value={form.budget_max}
          onChange={onChange}
          required
        />
        <button type="submit">Invia richiesta</button>
      </form>
      {message && <p className="hint">{message}</p>}
    </section>
  )
}

function CompanyPage() {
  const [requests, setRequests] = useState([])
  const [form, setForm] = useState({
    request_id: '',
    company_name: '',
    price: '',
    eta_days: '',
    note: '',
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await apiFetch('/requests')
        setRequests(data)
      } catch {
        setRequests([])
      }
    }

    loadRequests()
  }, [])

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    try {
      await apiFetch('/quotes', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          request_id: Number(form.request_id),
          price: Number(form.price),
          eta_days: Number(form.eta_days),
        }),
      })
      setMessage('Preventivo inviato correttamente.')
      setForm({ request_id: '', company_name: '', price: '', eta_days: '', note: '' })
    } catch {
      setMessage('Invio fallito. Seleziona una richiesta valida e controlla i campi.')
    }
  }

  return (
    <section className="page">
      <h1>Area Aziende</h1>
      <form className="form" onSubmit={onSubmit}>
        <select name="request_id" value={form.request_id} onChange={onChange} required>
          <option value="">Seleziona richiesta cliente</option>
          {requests.map((item) => (
            <option key={item.id} value={item.id}>
              #{item.id} - {item.work_type} ({item.city})
            </option>
          ))}
        </select>
        <input name="company_name" placeholder="Nome azienda" value={form.company_name} onChange={onChange} required />
        <input name="price" type="number" min="1" placeholder="Prezzo offerto" value={form.price} onChange={onChange} required />
        <input name="eta_days" type="number" min="1" placeholder="Tempi (giorni)" value={form.eta_days} onChange={onChange} required />
        <textarea name="note" placeholder="Dettagli offerta" value={form.note} onChange={onChange} required />
        <button type="submit">Invia preventivo</button>
      </form>
      {message && <p className="hint">{message}</p>}
    </section>
  )
}

function App() {
  return (
    <div className="site">
      <header className="header">
        <h2>Ristruttura Market</h2>
        <nav className="nav">
          <NavLink to="/" end>
            Mercato
          </NavLink>
          <NavLink to="/richiedi">Richiedi</NavLink>
          <NavLink to="/aziende">Azienda</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<MarketPage />} />
          <Route path="/richiedi" element={<RequestPage />} />
          <Route path="/aziende" element={<CompanyPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
