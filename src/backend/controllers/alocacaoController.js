import Alocacao from "../models/modelAlocacao.js";

const alocacaoController = {
  // LISTAR TODAS
  listar: async (req, res) => {
    try {
      const alocacoes = await Alocacao.findAll();
      return res.status(200).json(alocacoes);
    } catch (error) {
      console.error("Erro ao listar alocações:", error);
      return res.status(500).json({ error: "Erro ao listar alocações" });
    }
  },

  // BUSCAR POR ID
  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const alocacao = await Alocacao.findByPk(id);

      if (!alocacao) {
        return res.status(404).json({ error: "Alocação não encontrada" });
      }

      return res.status(200).json(alocacao);
    } catch (error) {
      console.error("Erro ao buscar alocação:", error);
      return res.status(500).json({ error: "Erro ao buscar alocação" });
    }
  },

  // CRIAR
  criar: async (req, res) => {
    try {
      const novaAlocacao = await Alocacao.create(req.body);
      return res.status(201).json(novaAlocacao);
    } catch (error) {
      console.error("Erro ao criar alocação:", error);
      return res.status(500).json({ error: "Erro ao criar alocação" });
    }
  },

  // EDITAR
  editar: async (req, res) => {
    try {
      const { id } = req.params;

      const alocacao = await Alocacao.findByPk(id);
      if (!alocacao) {
        return res.status(404).json({ error: "Alocação não encontrada" });
      }

      await alocacao.update(req.body);

      return res.status(200).json(alocacao);
    } catch (error) {
      console.error("Erro ao editar alocação:", error);
      return res.status(500).json({ error: "Erro ao editar alocação" });
    }
  },

  // DELETAR
  deletar: async (req, res) => {
    try {
      const { id } = req.params;

      const alocacao = await Alocacao.findByPk(id);
      if (!alocacao) {
        return res.status(404).json({ error: "Alocação não encontrada" });
      }

      await alocacao.destroy();

      return res.status(200).json({ message: "Alocação excluída com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar alocação:", error);
      return res.status(500).json({ error: "Erro ao deletar alocação" });
    }
  },
};

export default alocacaoController;
