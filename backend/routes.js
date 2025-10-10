const express = require('express');
const multer = require('multer');
const controller = require('./controller');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });


router.get('/criar-tabela', controller.criarTabela);

router.post('/upload-csv', upload.single('file'), controller.uploadCsv);

router.get('/escolas-dependencias', controller.listarDados);
router.get('/escolas-dependencias/:id', controller.listarUmDado);
router.post('/escolas-dependencias', controller.criarDado);
router.put('/escolas-dependencias/:id', controller.editarDado);
router.delete('/escolas-dependencias/:id', controller.excluirDado);


module.exports = router;