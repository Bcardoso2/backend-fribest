const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Romaneio extends Model {}

Romaneio.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Clientes",
        key: "id",
      },
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    funcionario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Funcionarios",
        key: "id",
      },
    },
  },
  {
    sequelize, // Conexão com o banco
    modelName: "Romaneio",
    tableName: "Romaneios",
    timestamps: true,
  }
);

module.exports = Romaneio;
