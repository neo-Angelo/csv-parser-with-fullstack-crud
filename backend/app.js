// app.js
const express = require('express');
const mysql = require('mysql2/promise');
const fs = require('fs');
const csv = require('csv-parser');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Usando Pool de Conexões para mais eficiência
const db = mysql.createPool({
  host: 'localhost',
  user: 'admin',
  password: 'admin',
  database: 'escolas',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(cors());


function normalizeKey(key) {
  if (!key) return '';
  return key
    .trim()
    .normalize('NFD')
    .replace(/[\u0000-\u001F\u007F-\u009F]|[\u0300-\u036f]/g, "") // Removendo acentos e caracteres
    .replace(/\s+/g, '') // Remove todos os espaços
    .toLowerCase();
}


function mapType(type) {
  if (!type) return 'VARCHAR(255)';
  const t = type.trim().toUpperCase();
  if (t.includes('NUMÉRICO INTEIRO') || t.includes('NUMÉRICO')) return 'INT';
  if (t.includes('DECIMAL')) return 'FLOAT';
  if (t.includes('DATA')) return 'DATE';
  if (t.includes('BOOLEANO')) return 'BOOLEAN';
  return 'VARCHAR(255)';
}


app.get('/criar-tabela', (req, res) => {
    const columns = [];
    fs.createReadStream('DIC_06_Escolas_Dependencias.csv')
        .pipe(csv({ separator: ';' }))
        .on('data', (row) => {
            // Normaliza as chaves do cabeçalho
            const normalized = {};
            for (const key in row) {
                normalized[normalizeKey(key)] = row[key];
            }
            const nome = normalized['nomedocampo']?.trim();
            const tipo = mapType(normalized['tipododado']);
            if (nome && tipo) {
                columns.push(`\`${nome}\` ${tipo}`);
            }
        })
        .on('end', async () => {
            if (columns.length === 0) {
                return res.status(400).send('Nenhuma coluna válida encontrada no CSV!');
            }
            const dropQuery = `DROP TABLE IF EXISTS escolas_dependencias;`;
            const createQuery = `CREATE TABLE IF NOT EXISTS escolas_dependencias (id INT AUTO_INCREMENT PRIMARY KEY, ${columns.join(', ')});`;
            try {
                await db.query(dropQuery);
                await db.query(createQuery);
                res.send('Tabela recriada com sucesso com a sua lógica original!');
            } catch (error) {
                res.status(500).send('Erro ao criar a tabela.');
            }
        });
});


const upload = multer({ dest: 'uploads/' });

app.post('/upload-csv', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Nenhum arquivo enviado.');
    }
    const filePath = req.file.path;
    const registros = [];

    fs.createReadStream(filePath)
        .pipe(csv({ separator: ';' }))
        .on('data', (row) => {
           
            registros.push(Object.values(row));
        })
        .on('end', async () => {
            if (registros.length === 0) {
                fs.unlinkSync(filePath);
                return res.status(400).send('Nenhum registro no CSV.');
            }

            const connection = await db.getConnection();
            try {
                // Busca as colunas da tabela no banco, na ordem correta, ignorando o ident
                const [dbColsResult] = await connection.query("SHOW COLUMNS FROM escolas_dependencias WHERE Field != 'id'");
                const dbColumnNames = dbColsResult.map(col => col.Field);

                await connection.beginTransaction();

               
                const colunasQueryPart = dbColumnNames.map(c => `\`${c}\``).join(', ');
                const placeholdersQueryPart = dbColumnNames.map(() => '?').join(', ');
                const query = `INSERT INTO escolas_dependencias (${colunasQueryPart}) VALUES (${placeholdersQueryPart})`;

                
                for (const registro of registros) {
                    
                    const valoresParaInserir = registro.slice(0, dbColumnNames.length);
                    await connection.query(query, valoresParaInserir);
                }

                await connection.commit();
                res.send(`Importação concluída! ${registros.length} registros processados.`);
            } catch (error) {
                await connection.rollback();
                console.error('Erro ao inserir dados:', error);
                res.status(500).send('Erro ao importar CSV.');
            } finally {
                connection.release();
                fs.unlinkSync(filePath);
            }
        });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});