const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');
const Funcionario = require('./Funcionario.js'); // Certifique-se de importar o modelo Funcionario

const Cliente = sequelize.define('Cliente', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Nome completo do cliente',
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    comment: 'CPF do cliente, deve ser único se preenchido',
  },
  cnpj: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    comment: 'CNPJ do cliente, deve ser único se preenchido',
  },
  data_criacao: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Data de criação do registro do cliente',
  },
  status: {
    type: DataTypes.ENUM('ativado', 'desativado'),
    allowNull: false,
    defaultValue: 'ativado',
    comment: 'Status do cliente, indicando se está ativo ou inativo',
  },
  telefone_principal: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Telefone principal para contato',
  },
  data_aniversario: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Data de aniversário do cliente',
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Endereço do cliente',
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Cidade do cliente',
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Estado do cliente',
  },
  funcionario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Funcionario,
      key: 'id',
    },
    comment: 'ID do funcionário vinculado ao cliente',
  },
}, {
  tableName: 'clientes',
  timestamps: false, // Desativa createdAt e updatedAt automáticos
  comment: 'Tabela para armazenar informações dos clientes',
});

// Associação entre Cliente e Funcionario
Cliente.belongsTo(Funcionario, { foreignKey: 'funcionario_id', as: 'funcionario' });

// Exportando o modelo Cliente
module.exports = Cliente;
