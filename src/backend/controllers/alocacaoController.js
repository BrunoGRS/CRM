import Alocacao from "../models/modelAlocacao.js";

// Função para tratar datas inválidas ou vazias
function normalizarData(valor) {
  if (!valor || valor.trim() === "") return null; // converte "" para NULL

  const dt = new Date(valor);
  if (isNaN(dt.getTime())) return null; // evita "Invalid date"

  return valor; // já está no formato YYYY-MM-DD vindo do front
}

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
      const dados = {
        maquina_id: req.body.maquina_id,
        cliente_id: req.body.cliente_id,
        data_inicio: normalizarData(req.body.data_inicio),
        data_fim: normalizarData(req.body.data_fim),
        status: req.body.status,
        local_instalacao: req.body.local_instalacao || null,
        responsavel_instalacao: req.body.responsavel_instalacao || null,
        observacoes: req.body.observacoes || null,
      };

      const novaAlocacao = await Alocacao.create(dados);
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

      const dadosAtualizados = {
        maquina_id: req.body.maquina_id,
        cliente_id: req.body.cliente_id,
        data_inicio: normalizarData(req.body.data_inicio),
        data_fim: normalizarData(req.body.data_fim),
        status: req.body.status,
        local_instalacao: req.body.local_instalacao || null,
        responsavel_instalacao: req.body.responsavel_instalacao || null,
        observacoes: req.body.observacoes || null,
      };

      await alocacao.update(dadosAtualizados);

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
