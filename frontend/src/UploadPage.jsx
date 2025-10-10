import { useState } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Selecione um arquivo CSV.');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:3000/upload-csv', {
        method: 'POST',
        body: formData,
      });
      const text = await res.text();
      setMessage(text);
    } catch (error) {
      setMessage('Erro ao enviar o arquivo.');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>Upload de CSV</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit" style={{ marginLeft: '1rem' }}>Enviar</button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}
