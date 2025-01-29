const Cliente = require('../models/Cliente.js');

const createCliente = async (req, res) => {
  try {
    // Verificar e tratar CPF vazio
    if (req.body.cpf === '') {
      req.body.cpf = null;
    }

    const cliente = await Cliente.create(req.body);
    res.status(201).json(cliente);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);

    // Logando detalhes do erro de validação
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(e => e.message);
      console.error('Erros de validação:', validationErrors);
    }

    res.status(500).json({
      error: 'Erro ao criar cliente',
      details: error.name === 'SequelizeValidationError' ? validationErrors : error.message,
    });
  }
};

// Exportando as funções
module.exports = { createCliente };
