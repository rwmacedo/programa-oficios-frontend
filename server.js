const express = require('express');
const path = require('path');
const app = express();

// Servir os arquivos estáticos da pasta 'dist'
app.use(express.static(path.join(__dirname, 'dist/programa-oficios-frontend/Browser')));

// Redirecionar todas as requisições para o 'index.html'
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/programa-oficios-frontend/Browser/index.html'));
});

// Configurar a porta para Heroku
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
