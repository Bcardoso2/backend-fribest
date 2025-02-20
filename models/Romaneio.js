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
      references: null, // ✅ Removido para evitar duplicação da FK
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
      references: null, // ✅ Removido para evitar duplicação da FK
    },
  },
  {
    sequelize,
    modelName: "Romaneio",
    tableName: "romaneios",
    timestamps: true,
  }
);

module.exports = Romaneio;
