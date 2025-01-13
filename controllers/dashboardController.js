const Pedido = require('../models/Pedido.js');
const Cliente = require('../models/Cliente.js');
const Produto = require('../models/ProdutoModels.js');
const { sequelize } = require('sequelize');

// Faturamento e despesas
const getResumo = async (req, res) => {
  try {
    const faturamento = await Pedido.sum('total', { where: { status: 'Entregue' } });
    const despesas = 80000; // Simulação
    res.json({ faturamento, despesas });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar resumo.' });
  }
};

// Clientes que mais compram
const getTopClientes = async (req, res) => {
  try {
    const clientes = await Pedido.findAll({
      attributes: ['cliente_id', [sequelize.fn('SUM', sequelize.col('total')), 'valorComprado']],
      group: ['cliente_id'],
      include: [{ model: Cliente, as: 'cliente', attributes: ['nome'] }],
      order: [[sequelize.literal('valorComprado'), 'DESC']],
      limit: 5,
    });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar clientes.' });
  }
};

// Estoque de produtos
const getEstoqueProdutos = async (req, res) => {
  try {
    const produtos = await Produto.findAll({ attributes: ['nome', 'estoque'] });
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar estoque.' });
  }
};

// Últimos pedidos
const getUltimosPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      order: [['data_pedido', 'DESC']],
      include: [{ model: Cliente, as: 'cliente', attributes: ['nome'] }],
      limit: 10,
    });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar últimos pedidos.' });
  }
};

// Exportando as funções
module.exports = {
  getResumo,
  getTopClientes,
  getEstoqueProdutos,
  getUltimosPedidos
};
