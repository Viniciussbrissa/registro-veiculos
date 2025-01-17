const express = require('express');
const mysql = require('mysql2');
require('dotenv').config(); // Carrega variáveis de ambiente

const app = express();
const port = process.env.PORT || 3000;

// Configuração do banco de dados MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Conectar ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        process.exit(1); // Encerra o processo se não conectar
    } else {
        console.log('Conectado ao banco de dados.');
    }
});

// Middleware para JSON
app.use(express.json());

// Rota para salvar dados
app.post('/registro-veiculos', (req, res) => {
    const { nome, veiculo, dataInicial, horarioInicial, destino, dataFinal, horarioFinal, kmRodado, observacoes } = req.body;

    if (!nome || !veiculo || !dataInicial || !horarioInicial || !destino) {
        return res.status(400).json({ error: 'Campos obrigatórios não fornecidos.' });
    }

    const query = `INSERT INTO registros (nome, veiculo, data_inicial, horario_inicial, destino, data_final, horario_final, km_rodado, observacoes)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
        query,
        [nome, veiculo, dataInicial, horarioInicial, destino, dataFinal, horarioFinal, kmRodado, observacoes],
        (err) => {
            if (err) {
                console.error('Erro ao salvar os dados:', err.message);
                return res.status(500).json({ error: 'Erro ao salvar os dados no banco de dados.' });
            }

            res.status(201).json({ message: 'Registro salvo com sucesso!' });
        }
    );
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
