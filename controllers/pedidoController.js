const Pedido = require('../models/Pedido.js');
const PedidoProduto = require('../models/PedidoProduto.js');
const Produto = require('../models/ProdutoModels.js');

// Função para criar um pedido
const createPedido = async (req, res) => {
  const { cliente_id, funcionario_id, produtos, valor_por_kg, observacao } = req.body;

  try {
    // Validações básicas
    if (!cliente_id || !funcionario_id || !produtos || produtos.length === 0 || !valor_por_kg) {
      return res.status(400).json({ error: 'Dados inválidos ou incompletos.' });
    }

    if (isNaN(valor_por_kg) || valor_por_kg <= 0) {
      return res.status(400).json({ error: 'O valor por kg deve ser um número positivo.' });
    }

    // Cria o pedido
    const pedido = await Pedido.create({
      cliente_id,
      funcionario_id,
      valor_por_kg, // Inclui o valor por kg
      observacao, // Inclui a observação
      data_pedido: new Date(),
    });

    // Adiciona os produtos ao pedido
    if (produtos && produtos.length > 0) {
      const produtosInseridos = [];

      for (const produto of produtos) {
        // Busca o produto no banco de dados
        const produtoDb = await Produto.findByPk(produto.produto_id);

        if (!produtoDb) {
          return res
            .status(404)
            .json({ error: `Produto com ID ${produto.produto_id} não encontrado.` });
        }

        if (produtoDb.estoque < produto.quantidade) {
          return res
            .status(400)
            .json({ error: `Estoque insuficiente para o produto ${produtoDb.nome}.` });
        }

        // Decrementa o estoque do produto
        produtoDb.estoque -= produto.quantidade;
        await produtoDb.save();

        produtosInseridos.push({
          pedido_id: pedido.id,
          produto_id: produto.produto_id,
          quantidade: produto.quantidade,
        });
      }

      // Adiciona os produtos ao pedido na tabela PedidoProduto
      await PedidoProduto.bulkCreate(produtosInseridos);
    }

    res.status(201).json({ message: 'Pedido criado com sucesso!', pedido });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ error: 'Erro ao criar pedido.' });
  }
};

// Função para buscar todos os pedidos
const getPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        {
          association: 'cliente',
          attributes: ['nome'],
        },
        {
          association: 'funcionario',
          attributes: ['nome'],
        },
        {
          association: 'produtosRelacionados',
          include: {
            association: 'produto',
            attributes: ['nome'],
          },
        },
      ],
    });

    res.status(200).json(pedidos);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos.' });
  }
};

// Função para atualizar o status de um pedido
const updatePedidoStatus = async (req, res) => {
  const { id } = req.params; // ID do pedido
  const { status } = req.body; // Novo status do pedido

  try {
    const pedido = await Pedido.findByPk(id);

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    // Atualiza o status do pedido
    pedido.status = status;
    await pedido.save();

    res.status(200).json({ message: 'Status do pedido atualizado com sucesso!', pedido });
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    res.status(500).json({ error: 'Erro ao atualizar status do pedido.' });
  }
};

// Exportando as funções
module.exports = {
  createPedido,
  getPedidos,
  updatePedidoStatus,
};
