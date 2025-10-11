
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CrudPage from './pages/Crud';
import UploadPage from './pages/UploadPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      
      <header className="app-header">
        <nav>
          <Link to="/">Ver Dados (CRUD)</Link>
          <Link to="/upload">Upload de CSV</Link>
        </nav>
      </header>

      
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