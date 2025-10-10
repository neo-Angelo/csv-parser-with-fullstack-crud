// src/pages/CrudPage.jsx
import { useState, useEffect } from "react";
import Modal from 'react-modal';

// ... (o código do modal e a configuração inicial permanecem os mesmos)
const customModalStyles = {
  content: {
    top: '50%', left: '50%', right: 'auto', bottom: 'auto',
    marginRight: '-50%', transform: 'translate(-50%, -50%)',
    maxHeight: '80vh', width: '60vw', overflowY: 'auto'
  },
};
Modal.setAppElement('#root');

export default function CrudPage() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);

  const fetchDados = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/escolas-dependencias');
      const data = await response.json();
      setDados(data);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);

  // As funções de abrir/fechar modal e excluir permanecem as mesmas
  const abrirModalDetalhes = async (id) => {
    try {
        const response = await fetch(`http://localhost:3000/escolas-dependencias/${id}`);
        const data = await response.json();
        setItemSelecionado(data);
        setModalIsOpen(true);
    } catch (error) {
        console.error("Erro ao buscar detalhes do item", error);
    }
  };
  const fecharModal = () => { setModalIsOpen(false); setItemSelecionado(null); };
  const handleExcluir = async (id) => {
    if (!window.confirm("Tem certeza?")) return;
    try {
      await fetch(`http://localhost:3000/escolas-dependencias/${id}`, { method: 'DELETE' });
      fetchDados();
    } catch (error) {
      alert("Falha ao excluir o registro.");
    }
  };

  if (loading) return <p>Carregando dados...</p>;

  // --- MUDANÇA PRINCIPAL AQUI ---
  // Define os cabeçalhos e as chaves de dados correspondentes às 8 colunas que você pediu
  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'nomedep', label: 'Nome Dep.' },
    { key: 'de', label: 'DE' },
    { key: 'mun', label: 'Município' },
    { key: 'distr', label: 'Distrito' },
    { key: 'codesc', label: 'Cód. Escola' },
    { key: 'nomesc', label: 'Nome Escola' },
    { key: 'salas_aula', label: 'Salas de Aula' },
  ];

  return (
    <div className="container">
      <h1>Tabela de Unidades Escolares</h1>
      <table className="crud-table">
        <thead>
          <tr>
            {headers.map(h => <th key={h.key}>{h.label}</th>)}
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {dados.map(item => (
            <tr key={item.id}>
              {headers.map(h => <td key={`${item.id}-${h.key}`}>{item[h.key]}</td>)}
              <td>
                <button onClick={() => abrirModalDetalhes(item.id)}>Detalhes</button>
                <button>Editar</button>
                <button onClick={() => handleExcluir(item.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* O Modal não precisa de alterações */}
      <Modal isOpen={modalIsOpen} onRequestClose={fecharModal} style={customModalStyles} contentLabel="Detalhes do Registro">
        {itemSelecionado && (
          <div>
            <h2>Detalhes do Registro ID: {itemSelecionado.id}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {Object.entries(itemSelecionado).map(([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong> {String(value)}
                </div>
              ))}
            </div>
            <button onClick={fecharModal} style={{ marginTop: '20px' }}>Fechar</button>
          </div>
        )}
      </Modal>
    </div>
  );
}