import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Selecione um arquivo CSV antes de enviar.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/upload-csv", {
        method: "POST",
        body: formData,
      });
      const text = await res.text();
      setMessage(text);
    } catch (err) {
      console.error(err);
      setMessage("Erro ao enviar o arquivo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h1>📤 Upload de Arquivo CSV</h1>

      <form onSubmit={handleSubmit} className="upload-form">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar CSV"}
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default App;
