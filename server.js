const express = require('express');
require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

// Criar pool de conexões
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'registro_veiculos',
    waitForConnections: true,
    connectionLimit: 10, // Limite de conexões simultâneas
    queueLimit: 0, // Sem limite para enfileiramento de conexões
});

// Middleware para parse de JSON
app.use(express.json());

// Testar conexão ao banco
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        process.exit(1); // Encerra o servidor se a conexão falhar
    } else {
        console.log('Conectado ao banco de dados com sucesso!');
        connection.release(); // Libera a conexão de volta para o pool
    }
});

// Rota para salvar dados
app.post('/registro-veiculos', (req, res) => {
    const { nome, veiculo, dataInicial, horarioInicial, destino, dataFinal, horarioFinal, kmRodado, observacoes } = req.body;

    // Validação simples
    if (!nome || !veiculo || !dataInicial || !horarioInicial || !destino) {
        return res.status(400).json({ error: 'Campos obrigatórios não fornecidos.' });
    }

    const query = `INSERT INTO registros 
        (nome, veiculo, data_inicial, horario_inicial, destino, data_final, horario_final, km_rodado, observacoes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    pool.query(query, [nome, veiculo, dataInicial, horarioInicial, destino, dataFinal, horarioFinal, kmRodado, observacoes], (err) => {
        if (err) {
            console.error('Erro ao salvar os dados no banco de dados:', err.message);
            return res.status(500).json({ error: 'Erro ao salvar os dados.' });
        }

        res.status(201).json({ message: 'Registro salvo com sucesso!' });
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
