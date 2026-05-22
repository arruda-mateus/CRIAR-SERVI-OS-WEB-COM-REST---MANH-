import express from "express";
import User from "../models/User.js";
import { autenticar } from "../middlewares/auth.js";

const router = express.Router();

router.get("/advogados", async (req, res) => {
  try {
    const { area } = req.query;

    const filtro = {
      tipo: "advogado",
      oabValidada: true
    };

    if (area && area !== "Todos") {
      filtro.areaAtuacao = area;
    }

    const advogados = await User.find(filtro).sort({ avaliacao: -1, nome: 1 });

    return res.json({ advogados });
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro ao listar advogados.", erro: erro.message });
  }
});

router.put("/perfil", autenticar, async (req, res) => {
  try {
    const camposPermitidos = ["nome", "telefone", "oab", "areaAtuacao", "cidade", "estado", "descricao"];

    camposPermitidos.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        req.usuario[campo] = req.body[campo];
      }
    });

    if (req.usuario.tipo === "advogado") {
      req.usuario.oabValidada = Boolean(req.usuario.oab && req.usuario.oab.length >= 6);
    }

    await req.usuario.save();

    return res.json({ mensagem: "Perfil atualizado com sucesso.", usuario: req.usuario });
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro ao atualizar perfil.", erro: erro.message });
  }
});

export default router;
