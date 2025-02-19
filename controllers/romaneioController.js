const Romaneio = require("../models/Romaneio.js");
const Cliente = require("../models/Cliente.js");
const Funcionario = require("../models/Funcionario.js");
const PedidoProduto = require("../models/PedidoProduto.js");
const Produto = require("../models/ProdutoModels.js");
const Pedido = require("../models/Pedido.js");

// 🔹 LISTAR TODOS OS ROMANEIOS (INCLUINDO CLIENTE, FUNCIONÁRIO, PRODUTOS E PESOS)
const getAllRomaneios = async (req, res) => {
  try {
    const romaneios = await Romaneio.findAll({
      include: [
        { model: Cliente, as: "cliente" },
        { model: Funcionario, as: "funcionario" },
        { 
          model: PedidoProduto, 
          as: "produtos",
          include: [
            { model: Produto, as: "produto" },
            { model: Pedido, as: "pedidoDetalhes" } // Corrigido para o alias correto
          ]
        },
      ],
    });

    // Calcular o total e garantir que os pesos apareçam corretamente
    const romaneiosComTotal = romaneios.map((romaneio) => {
      let totalRomaneio = 0;

      // Verificamos se há produtos no romaneio
      const produtosCorrigidos = romaneio.produtos.map((produto) => {
        let pesos = [];

        try {
          // Garante que os pesos sejam um array válido
          pesos = typeof produto.pesos === "string" ? JSON.parse(produto.pesos) : produto.pesos || [];
        } catch (error) {
          console.error("Erro ao converter pesos:", error);
          pesos = [];
        }

        // Calcula o peso total
        const totalKg = pesos.reduce((acc, peso) => acc + peso, 0);
        const valorPorKg = produto.pedidoDetalhes?.valor_por_kg || 0;

        // Acumulamos o valor total do romaneio
        totalRomaneio += totalKg * valorPorKg;

        return {
          ...produto.toJSON(),
          pesos, // Retorna os pesos corretamente
        };
      });

      return {
        ...romaneio.toJSON(),
        produtos: produtosCorrigidos, // Retorna os produtos com pesos corrigidos
        totalRomaneio, // Adiciona o total calculado
      };
    });

    res.status(200).json(romaneiosComTotal);
  } catch (error) {
    console.error("Erro ao buscar romaneios:", error);
    res.status(500).json({ error: "Erro ao buscar romaneios" });
  }
};


// 🔹 CRIAR UM NOVO ROMANEIO
const createRomaneio = async (req, res) => {
  const { cliente_id, status, observacoes, funcionario_id, produtos } = req.body;

  try {
    // Criar o romaneio
    const novoRomaneio = await Romaneio.create({
      cliente_id,
      status,
      observacoes,
      funcionario_id,
    });

    // Criar os produtos vinculados ao romaneio
    if (produtos && produtos.length > 0) {
      for (const produto of produtos) {
        if (!produto.produto_id) {
          console.error("❌ ERRO: produto_id está indefinido ou ausente!", produto);
          return res.status(400).json({ error: "Produto ID ausente na requisição." });
        }
        
        console.log("✅ Produto recebido para salvar no romaneio:", produto);
        

        await PedidoProduto.create({
          pedido_id: produto.pedido_id,
          produto_id: produto.produto_id, // ✅ Garantindo que está presente
          quantidade: produto.quantidade,
          romaneio_id: novoRomaneio.id,
          pesos: JSON.stringify(produto.pesos), // ✅ Salvando corretamente como JSON
        });
      }
    }
    console.log("Recebendo produtos para o romaneio:", produtos);

    res.status(201).json({ message: "Romaneio criado com sucesso!", romaneio: novoRomaneio });
  } catch (error) {
    console.error("Erro ao criar romaneio:", error);
    res.status(500).json({ error: "Erro ao criar romaneio." });
  }
};

const updateRomaneio = async (req, res) => {
  const { id } = req.params;
  const { status, observacoes, produtos } = req.body;

  try {
    console.log("📦 Recebendo atualização do romaneio:", JSON.stringify(req.body, null, 2));

    const romaneio = await Romaneio.findByPk(id);

    if (!romaneio) {
      return res.status(404).json({ error: "Romaneio não encontrado" });
    }

    // Atualizar status e observações
    await romaneio.update({ status, observacoes });

    if (produtos && produtos.length > 0) {
      for (const produto of produtos) {
        if (!produto.produto_id) {
          console.warn(`⚠️ Produto sem ID na requisição:`, produto);
          continue;
        }

        console.log(`🔄 Buscando produto ${produto.produto_id} no romaneio ${id}...`);

        let produtoAtual = await PedidoProduto.findOne({
          where: { romaneio_id: id, produto_id: produto.produto_id },
        });

        if (produtoAtual) {
          console.log(`✅ Produto ${produto.produto_id} encontrado. Atualizando pesos para:`, produto.pesos);
          
          // Atualizar os pesos como JSON
          await produtoAtual.update({ pesos: JSON.stringify(produto.pesos) });

          console.log(`✅ Pesos do produto ${produto.produto_id} atualizados com sucesso!`);
        } else {
          console.warn(`⚠️ Produto ${produto.produto_id} não encontrado no romaneio. Buscando pedido original...`);

          // Buscar pedido original para preencher os campos obrigatórios
          const pedidoOriginal = await PedidoProduto.findOne({
            where: { produto_id: produto.produto_id },
          });

          if (!pedidoOriginal) {
            console.error(`❌ ERRO: Pedido não encontrado para o produto ${produto.produto_id}!`);
            continue; // Pula esse produto para evitar erro de `null`
          }

          console.log(`📌 Pedido encontrado: pedido_id = ${pedidoOriginal.pedido_id}, quantidade = ${pedidoOriginal.quantidade}`);

          // Criar um novo registro para o produto dentro do romaneio
          await PedidoProduto.create({
            pedido_id: pedidoOriginal.pedido_id,
            produto_id: produto.produto_id,
            quantidade: pedidoOriginal.quantidade, // ✅ Pegando a quantidade do pedido original
            romaneio_id: id,
            pesos: JSON.stringify(produto.pesos),
          });

          console.log(`✅ Novo produto ${produto.produto_id} criado no romaneio ${id}`);
        }
      }
    }

    res.status(200).json({ message: "Romaneio atualizado com sucesso!", romaneio });
  } catch (error) {
    console.error("❌ Erro ao atualizar romaneio:", error.message);
    res.status(500).json({ error: "Erro ao atualizar romaneio." });
  }
};



// 🔹 EXCLUIR ROMANEIO (REMOVENDO OS PRODUTOS VINCULADOS ANTES)
const deleteRomaneio = async (req, res) => {
  const { id } = req.params;

  try {
    const romaneio = await Romaneio.findByPk(id);
    if (!romaneio) {
      return res.status(404).json({ error: "Romaneio não encontrado" });
    }

    // Remover produtos antes de excluir o romaneio
    await PedidoProduto.destroy({ where: { romaneio_id: id } });

    // Excluir romaneio
    await romaneio.destroy();
    res.status(200).json({ message: "Romaneio excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir romaneio:", error.message);
    res.status(500).json({ error: "Erro ao excluir romaneio" });
  }
};

module.exports = {
  getAllRomaneios,
  createRomaneio,
  updateRomaneio,
  deleteRomaneio,
};
