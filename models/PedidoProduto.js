const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");

// Definição do modelo PedidoProduto
const PedidoProduto = sequelize.define(
  "PedidoProduto",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Pedidos",
        key: "id",
      },
    },
    produto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Produtos",
        key: "id",
      },
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    romaneio_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Pode ser nulo antes de ser vinculado a um romaneio
      references: {
        model: "Romaneios",
        key: "id",
      },
    },
    pesos: {
      type: DataTypes.JSON, // Armazena os pesos como JSON no banco de dados
      allowNull: true,
    },
  },
  {
    tableName: "pedido_produtos",
    timestamps: false, // Se necessário, pode habilitar timestamps
  }
);

module.exports = PedidoProduto;
