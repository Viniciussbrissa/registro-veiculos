const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Configuração do banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: '123456',
    database: 'registro_veiculos',
});

// Conectar ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados.');
    }
});

// Middleware para JSON
app.use(bodyParser.json());

// Rota para salvar dados
app.post('/registro-veiculos', (req, res) => {
    const { nome, veiculo, dataInicial, horarioInicial, destino, dataFinal, horarioFinal, kmRodado, observacoes } = req.body;

    const query = `INSERT INTO registros (nome, veiculo, data_inicial, horario_inicial, destino, data_final, horario_final, km_rodado, observacoes)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [nome, veiculo, dataInicial, horarioInicial, destino, dataFinal, horarioFinal, kmRodado, observacoes], (err) => {
        if (err) {
            console.error('Erro ao salvar os dados:', err.message);
            res.status(500).send('Erro ao salvar os dados');
        } else {
            res.status(200).send('Registro salvo com sucesso!');
        }
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando em https://registro-veiculos-backend.onrender.com:${port}`);
});
