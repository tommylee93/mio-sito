import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'

function HomePage() {
  return (
    <section className="page">
      <h1>Home</h1>
      <p>Questa e la pagina principale del sito di prova.</p>
    </section>
  )
}

function AboutPage() {
  return (
    <section className="page">
      <h1>Chi Siamo</h1>
      <p>Siamo un progetto demo creato con React e Vite.</p>
    </section>
  )
}

function ContactPage() {
  return (
    <section className="page">
      <h1>Contatti</h1>
      <p>Scrivici a: demo@example.com</p>
    </section>
  )
}

function App() {
  return (
    <div className="site">
      <header className="header">
        <h2>Sito Prova</h2>
        <nav className="nav">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/chi-siamo">Chi Siamo</NavLink>
          <NavLink to="/contatti">Contatti</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chi-siamo" element={<AboutPage />} />
          <Route path="/contatti" element={<ContactPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
