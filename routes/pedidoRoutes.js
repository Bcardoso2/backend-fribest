const express = require('express');
const { createPedido, getPedidos, updatePedidoStatus } = require('../controllers/pedidoController.js');

const router = express.Router();

// Rota para criar um pedido
router.post('/', createPedido);

// Rota para listar pedidos
router.get('/', getPedidos);

// Rota para atualizar o status de um pedido
router.put('/:id/status', updatePedidoStatus); 

// Exportando o router
module.exports = router;
