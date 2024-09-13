const express = require('express');
const path = require('path');
const app = express();

// Servir os arquivos estáticos do diretório 'dist/<nome-do-seu-projeto>'
app.use(express.static(path.join(__dirname, 'dist/programa-oficios-frontend')));

// Enviar todas as rotas para o arquivo 'index.html'
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/programa-oficios-frontend/src/index.html'));
});

// Definir a porta para o Heroku
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
