const express = require('express');
const cors = require('cors');
const routes = require('./routes'); // Importa o arquivo de rotas

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Diz ao Express para usar o arquivo de rotas para gerenciar todos os endpoints
app.use('/', routes);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor modularizado rodando em http://localhost:${PORT}`);
});