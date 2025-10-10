const express = require('express');
const multer = require('multer');
const controller = require('./controller');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Rota para criar a tabela
router.get('/criar-tabela', controller.criarTabela);

// Rota para fazer o upload dos dados do CSV
router.post('/upload-csv', upload.single('file'), controller.uploadCsv);

// Rota para listar os dados (Read)
router.get('/escolas-dependencias', controller.listarDados);
// Rota para buscar um único dado pelo ID (Read One)
router.get('/escolas-dependencias/:id', controller.listarUmDado);
// Rota para criar um novo dado (Create)
router.post('/escolas-dependencias', controller.criarDado);
// Rota para editar um dado (Update)
router.put('/escolas-dependencias/:id', controller.editarDado);
// Rota para excluir um dado (Delete)
router.delete('/escolas-dependencias/:id', controller.excluirDado);


module.exports = router;