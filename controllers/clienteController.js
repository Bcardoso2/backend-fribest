const Cliente = require('../models/Cliente.js');

const getAllClientes = async (req, res) => {
  try {
    const { funcionario_id = null } = req.query;

    const clientes = await Cliente.findAll({
      where: funcionario_id ? { funcionario_id } : {},
    });

    res.json(clientes);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({
      error: 'Erro ao buscar clientes',
      details: error.message,
    });
  }
};

const createCliente = async (req, res) => {
  try {
    // Se CPF ou CNPJ estiverem vazios, definir como null
    req.body.cpf = req.body.cpf?.trim() || null;
    req.body.cnpj = req.body.cnpj?.trim() || null;

    const cliente = await Cliente.create(req.body);
    res.status(201).json(cliente);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);

    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(e => e.message);
      console.error('Erros de validação:', validationErrors);
      return res.status(400).json({ error: 'Erro de validação', details: validationErrors });
    }

    res.status(500).json({
      error: 'Erro ao criar cliente',
      details: error.message,
    });
  }
};

// Exportando as funções getAllClientes e createCliente
module.exports = { getAllClientes, createCliente };
