const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');
const Cliente = require('./Cliente.js'); // Importa o modelo Cliente

const Pedido = sequelize.define(
  'Pedido',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    funcionario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    data_pedido: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('Aguardando', 'Embarcando', 'Em transito', 'Entregue', 'Cancelado'),
      defaultValue: 'Aguardando',
      allowNull: false,
    },
  },
  {
    tableName: 'pedidos',
    timestamps: false,
  }
);

// Definindo a associação com o modelo Cliente
Pedido.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });

module.exports = Pedido;
