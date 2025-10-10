// controller.js
const fs = require('fs');
const csv = require('csv-parser');
const db = require('./db'); 


function normalizeKey(key) {
  if (!key) return '';
  return key.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').toLowerCase();
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


exports.criarTabela = (req, res) => {
    const columns = [];
    fs.createReadStream('DIC_06_Escolas_Dependencias.csv')
        .pipe(csv({ separator: ';' }))
        .on('data', (row) => {
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
            const dropQuery = `DROP TABLE IF EXISTS escolas_dependencias;`;
            const createQuery = `CREATE TABLE IF NOT EXISTS escolas_dependencias (id INT AUTO_INCREMENT PRIMARY KEY, ${columns.join(', ')});`;
            try {
                await db.query(dropQuery);
                await db.query(createQuery);
                res.send('Tabela recriada com sucesso!');
            } catch (error) {
                res.status(500).send('Erro ao criar a tabela.');
            }
        });
};


exports.uploadCsv = (req, res) => {
    if (!req.file) return res.status(400).send('Nenhum arquivo enviado.');
    
    const filePath = req.file.path;
    const registros = [];

    fs.createReadStream(filePath)
        .pipe(csv({ separator: ';' }))
        .on('data', (row) => registros.push(Object.values(row)))
        .on('end', async () => {
            if (registros.length === 0) {
                fs.unlinkSync(filePath);
                return res.status(400).send('Nenhum registro no CSV.');
            }
            const connection = await db.getConnection();
            try {
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
};



exports.listarDados = async (req, res) => {
    try {
        // Query CORRIGIDA para selecionar as colunas exatas
        const query = "SELECT id, nomedep, de, mun, distr, codesc, nomesc, salas_aula FROM escolas_dependencias ORDER BY id DESC LIMIT 100";
        
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        res.status(500).send('Erro ao buscar dados do banco de dados.');
    }
};

// READ (One) - Nova função para buscar TODOS os detalhes de UM registro
exports.listarUmDado = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM escolas_dependencias WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).send('Registro não encontrado.');
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erro ao buscar um dado:', error);
        res.status(500).send('Erro ao buscar o dado.');
    }
};

// DELETE - Nova função para excluir um registro
exports.excluirDado = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM escolas_dependencias WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send('Registro não encontrado.');
        }
        res.status(200).send({ message: 'Registro excluído com sucesso.' });
    } catch (error) {
        console.error('Erro ao excluir registro:', error);
        res.status(500).send('Erro ao excluir registro.');
    }
};

// CREATE - Nova função para criar um registro
exports.criarDado = async (req, res) => {
    const colunas = Object.keys(req.body).map(k => `\`${k}\``).join(', ');
    const placeholders = Object.keys(req.body).map(() => '?').join(', ');
    const valores = Object.values(req.body);

    const query = `INSERT INTO escolas_dependencias (${colunas}) VALUES (${placeholders})`;
    try {
        const [result] = await db.query(query, valores);
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        console.error('Erro ao criar registro:', error);
        res.status(500).send('Erro ao criar registro.');
    }
};

// UPDATE - Nova função para editar um registro
exports.editarDado = async (req, res) => {
    const { id } = req.params;
    const campos = Object.keys(req.body).map(key => `\`${key}\` = ?`).join(', ');
    const valores = Object.values(req.body);

    const query = `UPDATE escolas_dependencias SET ${campos} WHERE id = ?`;
    try {
        const [result] = await db.query(query, [...valores, id]);
        if (result.affectedRows === 0) {
            return res.status(404).send('Registro não encontrado.');
        }
        res.status(200).json({ id, ...req.body });
    } catch (error) {
        console.error('Erro ao editar registro:', error);
        res.status(500).send('Erro ao editar registro.');
    }
};