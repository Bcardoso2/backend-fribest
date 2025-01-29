const Cliente = require('../models/Cliente.js');

const getAllClientes = async (req, res) => {
  try {
    const { funcionario_id = null } = req.query;

    const clientes = await Cliente.findAll({
      where: funcionario_id ? { funcionario_id } : {},
    });

    res.json(clientes);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error); // Log do erro
    res.status(500).json({
      error: 'Erro ao buscar clientes',
      details: error.message, // Detalhes adicionais para ajudar na depuração
    });
  }
};

const createCliente = async (req, res) => {
  try {
    // Verificar se o CPF está vazio e transformar em null
    if (req.body.cpf === '') {
      req.body.cpf = null;
    }

    const cliente = await Cliente.create(req.body);
    res.status(201).json(cliente);
  } catch (error) {
    console.error('Erro ao criar cliente:', error); // Log do erro

    // Logando detalhes do erro de validação
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(e => e.message);
      console.error('Erros de validação:', validationErrors);
    }

    // Resposta de erro com detalhes específicos
    res.status(500).json({
      error: 'Erro ao criar cliente',
      details: error.name === 'SequelizeValidationError' ? validationErrors : error.message, // Detalhes específicos para erro de validação
    });
  }
};

// Exportando as funções getAllClientes e createCliente
module.exports = { getAllClientes, createCliente };
