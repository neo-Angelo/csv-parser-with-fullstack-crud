const express = require('express');
const multer = require('multer');
const controller = require('./controller');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Rota para criar a tabela
router.get('/criar-tabela', controller.criarTabela);

// Rota para fazer o upload dos dados do CSV
router.post('/upload-csv', upload.single('file'), controller.uploadCsv);

// Rota para listar os dados 
router.get('/escolas-dependencias', controller.listarDados);

module.exports = router;