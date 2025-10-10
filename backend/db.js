const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'admin', // Seu usuário
  password: 'admin', // Sua senha
  database: 'escolas',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('sql conectado.');

module.exports = pool;