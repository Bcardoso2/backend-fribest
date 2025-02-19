const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/database.js"); // Instância do Sequelize
const configureAssociations = require("./models/associations.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Teste de conexão com o banco e inicialização das associações
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexão com o banco bem-sucedida!");

    // Envolvendo as associações em try-catch para identificar erro exato
    try {
      configureAssociations(); 
      console.log("✅ Associações carregadas!");
    } catch (error) {
      console.error("❌ Erro ao configurar associações:", error);
      console.error(`📍 Erro na linha: ${error.stack.split("\n")[1]}`); // Mostra a linha exata do erro
      process.exit(1);
    }

    await sequelize.sync(); // Criar tabelas automaticamente
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco:", error);
    console.error(`📍 Erro na linha: ${error.stack.split("\n")[1]}`); // Mostra a linha exata do erro
    process.exit(1);
  }
})();

// Importa as rotas
const clientRoutes = require("./routes/clientRoutes.js");
const produtoRoutes = require("./routes/produtoRoutes.js");
const contasPagarRoutes = require("./routes/ContasPagarRoutes.js");
const pedidoRoutes = require("./routes/pedidoRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");
const funcionarioRoutes = require("./routes/funcionarioRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const romaneioRoutes = require("./routes/romaneioRoutes.js");

app.use("/api/auth", authRoutes);
app.use("/api/clientes", clientRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/contas-a-pagar", contasPagarRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/funcionarios", funcionarioRoutes);
app.use("/api/romaneios", romaneioRoutes);

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Rota não encontrada." });
});

// Tratamento global de erros
app.use((err, req, res, next) => {
  console.error("❌ Erro interno no servidor:", err);
  res.status(500).json({ success: false, message: "Erro interno no servidor." });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

module.exports = app;
