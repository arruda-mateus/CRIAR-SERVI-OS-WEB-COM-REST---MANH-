import express from "express";
import Solicitacao from "../models/Solicitacao.js";
import User from "../models/User.js";
import { autenticar, permitirTipos } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", autenticar, permitirTipos(["cliente"]), async (req, res) => {
  try {
    const { advogadoId, area, descricao } = req.body;

    if (!advogadoId || !area || !descricao || descricao.trim().length < 10) {
      return res.status(400).json({ mensagem: "Informe advogado, área e uma descrição com no mínimo 10 caracteres." });
    }

    const advogado = await User.findOne({ _id: advogadoId, tipo: "advogado" });

    if (!advogado) {
      return res.status(404).json({ mensagem: "Advogado não encontrado." });
    }

    const novaSolicitacao = await Solicitacao.create({
      cliente: req.usuario._id,
      advogado: advogado._id,
      area,
      descricao
    });

    await novaSolicitacao.populate("cliente", "nome email telefone tipo");
    await novaSolicitacao.populate("advogado", "nome email telefone tipo oab areaAtuacao cidade estado oabValidada");

    return res.status(201).json({
      mensagem: "Solicitação enviada com sucesso.",
      solicitacao: novaSolicitacao
    });
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro ao criar solicitação.", erro: erro.message });
  }
});

router.get("/minhas", autenticar, async (req, res) => {
  try {
    const filtro = req.usuario.tipo === "cliente"
      ? { cliente: req.usuario._id }
      : { advogado: req.usuario._id };

    const solicitacoes = await Solicitacao.find(filtro)
      .populate("cliente", "nome email telefone tipo")
      .populate("advogado", "nome email telefone tipo oab areaAtuacao cidade estado oabValidada")
      .sort({ createdAt: -1 });

    return res.json({ solicitacoes });
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro ao listar solicitações.", erro: erro.message });
  }
});

router.patch("/:id/status", autenticar, permitirTipos(["advogado"]), async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pendente", "em andamento", "finalizada", "recusada"].includes(status)) {
      return res.status(400).json({ mensagem: "Status inválido." });
    }

    const solicitacao = await Solicitacao.findOne({
      _id: req.params.id,
      advogado: req.usuario._id
    })
      .populate("cliente", "nome email telefone tipo")
      .populate("advogado", "nome email telefone tipo oab areaAtuacao cidade estado oabValidada");

    if (!solicitacao) {
      return res.status(404).json({ mensagem: "Solicitação não encontrada." });
    }

    solicitacao.status = status;
    await solicitacao.save();

    return res.json({ mensagem: "Status atualizado com sucesso.", solicitacao });
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro ao atualizar solicitação.", erro: erro.message });
  }
});

export default router;
