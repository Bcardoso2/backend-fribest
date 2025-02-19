const express = require('express');
const {
  getAllRomaneios,
  createRomaneio,
  updateRomaneio,
  deleteRomaneio,
} = require('../controllers/romaneioController');

const router = express.Router();

// Rotas para romaneios
router.get('/', getAllRomaneios); // Listar todos os romaneios
router.post('/', createRomaneio); // Criar um novo romaneio
router.put('/:id', updateRomaneio); // Atualizar um romaneio existente
router.delete('/:id', deleteRomaneio); // Excluir um romaneio

// Exportando o router
module.exports = router;
