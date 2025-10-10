// src/App.jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CrudPage from './pages/Crud';
import UploadPage from './pages/UploadPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      {/* O header continua como está */}
      <header className="app-header">
        <nav>
          <Link to="/">Ver Dados (CRUD)</Link>
          <Link to="/upload">Upload de CSV</Link>
        </nav>
      </header>

      {/* --- CORREÇÃO AQUI --- */}
      {/* Adicionando a div que o CSS usa para centralizar o conteúdo */}
      <div className="content-wrapper">
        <main>
          <Routes>
            <Route path="/" element={<CrudPage />} />
            <Route path="/upload" element={<UploadPage />} />
          </Routes>
        </main>
      </div>
      
    </BrowserRouter>
  );
}

export default App;