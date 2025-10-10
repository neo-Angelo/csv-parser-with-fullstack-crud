// app.js
const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const PORT = 3000;


const db = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'admin',
  database: 'escolas'
});

// Conecta ao banco
db.connect(err => {
  if (err) throw err;
  console.log('Conectado ao MySQL!');
});

// Mapeia tipos do CSV para tipos MySQL
function mapType(type) {
  if (!type) return 'VARCHAR(255)';
  const t = type.trim().toUpperCase();
  if (t.includes('NUMÉRICO INTEIRO')) return 'INT';
  if (t.includes('NUMÉRICO')) return 'INT';
  if (t.includes('DECIMAL')) return 'FLOAT';
  if (t.includes('DATA')) return 'DATE';
  if (t.includes('BOOLEANO')) return 'BOOLEAN';
  return 'VARCHAR(255)';
}

// Função para remover acentos e espaços das chaves do CSV
function normalizeKey(key) {
  return key.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '');
}

// Lê o CSV e cria a tabela
function createTableFromCSV(csvPath) {
  const columns = [];

  fs.createReadStream(csvPath)
    .pipe(csv({ separator: ';' }))
    .on('data', row => {
      // Normaliza as chaves do cabeçalho
      const normalized = {};
      for (const key in row) {
        normalized[normalizeKey(key)] = row[key];
      }

      // Agora acessamos as colunas normalizadas
      const nome = normalized['NomedoCampo']?.trim();
      const tipo = mapType(normalized['TipodoDado']);

      if (nome && tipo) columns.push(`\`${nome}\` ${tipo}`);
    })
    .on('end', () => {
      if (columns.length === 0) {
        console.error('Nenhuma coluna válida encontrada no CSV!');
        return;
      }

      const createQuery = `
        CREATE TABLE IF NOT EXISTS escolas_dependencias (
          id INT AUTO_INCREMENT PRIMARY KEY,
          ${columns.join(',\n  ')}
        );
      `;

      db.query(createQuery, err => {
        if (err) throw err;
        console.log('Tabela "escolas_dependencias" criada com sucesso!');
      });
    });
}

// Rota para criar a tabela
app.get('/criar-tabela', (req, res) => {
  createTableFromCSV('DIC_06_Escolas_Dependencias.csv');
  res.send('Criando tabela a partir do CSV...');
});

// Inicia o servidor
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));