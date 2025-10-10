// src/pages/CrudPage.jsx
import { useState, useEffect } from "react";
import Modal from 'react-modal';
import '../App.css'; // Importando o CSS para os estilos dos botões

// Estilos para o Modal
const customModalStyles = {
  content: {
    top: '50%', left: '50%', right: 'auto', bottom: 'auto',
    marginRight: '-50%', transform: 'translate(-50%, -50%)',
    maxHeight: '80vh', width: '60vw', overflowY: 'auto',
    backgroundColor: '#fff', borderRadius: '8px', padding: '2rem'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  }
};
Modal.setAppElement('#root');

export default function CrudPage() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal de Detalhes
  const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);

  // Modal do Formulário (Criar/Editar)
  const [formModalIsOpen, setFormModalIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Busca a lista simplificada de dados
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

  // --- Funções do Modal de Detalhes ---
  const abrirModalDetalhes = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/escolas-dependencias/${id}`);
      const data = await response.json();
      setItemSelecionado(data);
      setDetailsModalIsOpen(true);
    } catch (error) {
      console.error("Erro ao buscar detalhes do item", error);
    }
  };
  const fecharModalDetalhes = () => {
    setDetailsModalIsOpen(false);
    setItemSelecionado(null);
  };

  // --- Funções do Modal de Formulário ---
  const abrirFormModal = (item = null) => {
    setEditingItem(item);
    setFormData(item ? { nomesc: item.nomesc, mun: item.mun, distr: item.distr } : { nomesc: '', mun: '', distr: '' });
    setFormModalIsOpen(true);
  };
  const fecharFormModal = () => {
    setFormModalIsOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const method = editingItem ? 'PUT' : 'POST';
    const url = editingItem
      ? `http://localhost:3000/escolas-dependencias/${editingItem.id}`
      : `http://localhost:3000/escolas-dependencias`;
    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Falha na requisição');
      fetchDados();
      fecharFormModal();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Falha ao salvar o registro.");
    }
  };

  // --- Função de Excluir ---
  const handleExcluir = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este registro?")) return;
    try {
      await fetch(`http://localhost:3000/escolas-dependencias/${id}`, { method: 'DELETE' });
      fetchDados();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Falha ao excluir o registro.");
    }
  };

  if (loading) return <p>Carregando dados...</p>;
  
  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'nomesc', label: 'Nome Escola' },
    { key: 'mun', label: 'Município' },
    { key: 'distr', label: 'Distrito' },
  ];

  return (
    <div className="container">
      <h1>Tabela de Unidades Escolares</h1>
      <button onClick={() => abrirFormModal()} style={{ marginBottom: '1rem' }}>Adicionar Novo</button>
      <div className="table-wrapper">
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
                  <button className="btn-details" onClick={() => abrirModalDetalhes(item.id)}>Detalhes</button>
                  <button className="btn-edit" onClick={() => abrirFormModal(item)}>Editar</button>
                  <button className="btn-delete" onClick={() => handleExcluir(item.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={detailsModalIsOpen} onRequestClose={fecharModalDetalhes} style={customModalStyles}>
        {itemSelecionado && (
          <div>
            <h2>Detalhes do Registro ID: {itemSelecionado.id}</h2>
            <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '15px' }}>
                {Object.entries(itemSelecionado).map(([key, value]) => (
                    <div key={key} style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                    <strong>{key}:</strong> {String(value)}
                    </div>
                ))}
            </div>
            <button onClick={fecharModalDetalhes} style={{ marginTop: '20px' }}>Fechar</button>
          </div>
        )}
      </Modal>

      <Modal isOpen={formModalIsOpen} onRequestClose={fecharFormModal} style={customModalStyles}>
        <h2>{editingItem ? 'Editar Registro' : 'Adicionar Novo Registro'}</h2>
        <form onSubmit={handleFormSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <label>
              Nome da Escola:
              <input type="text" name="nomesc" value={formData.nomesc || ''} onChange={handleFormChange} required style={{width: '98%', padding: '8px', marginTop: '5px'}}/>
            </label>
            <label>
              Município:
              <input type="text" name="mun" value={formData.mun || ''} onChange={handleFormChange} required style={{width: '98%', padding: '8px', marginTop: '5px'}}/>
            </label>
            <label>
              Distrito:
              <input type="text" name="distr" value={formData.distr || ''} onChange={handleFormChange} style={{width: '98%', padding: '8px', marginTop: '5px'}}/>
            </label>
          </div>
          <div style={{ marginTop: '20px' }}>
            <button type="submit">Salvar</button>
            <button type="button" onClick={fecharFormModal} style={{ marginLeft: '10px' }}>Cancelar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}