import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { autenticar } from "../middlewares/auth.js";

const router = express.Router();

function validarTexto(texto, minimo, campo) {
  if (!texto || texto.trim().length < minimo) {
    return `${campo} precisa ter no mínimo ${minimo} caracteres.`;
  }

  return null;
}

function validarEmail(email) {
  if (!email || !email.includes("@") || !email.includes(".")) {
    return "E-mail inválido.";
  }

  return null;
}

function validarSenha(senha) {
  if (!senha || senha.length < 8) {
    return "A senha precisa ter no mínimo 8 caracteres.";
  }

  return null;
}

router.post("/registro", async (req, res) => {
  try {
    const {
      nome,
      email,
      senha,
      telefone,
      tipo,
      oab,
      areaAtuacao,
      cidade,
      estado,
      descricao
    } = req.body;

    const erroNome = validarTexto(nome, 3, "Nome");
    if (erroNome) return res.status(400).json({ mensagem: erroNome });

    const erroEmail = validarEmail(email);
    if (erroEmail) return res.status(400).json({ mensagem: erroEmail });

    const erroSenha = validarSenha(senha);
    if (erroSenha) return res.status(400).json({ mensagem: erroSenha });

    const erroTelefone = validarTexto(telefone, 10, "Telefone");
    if (erroTelefone) return res.status(400).json({ mensagem: erroTelefone });

    if (!["cliente", "advogado"].includes(tipo)) {
      return res.status(400).json({ mensagem: "Tipo de usuário inválido." });
    }

    if (tipo === "advogado") {
      const erroOab = validarTexto(oab, 6, "OAB");
      if (erroOab) return res.status(400).json({ mensagem: erroOab });

      const erroArea = validarTexto(areaAtuacao, 3, "Área de atuação");
      if (erroArea) return res.status(400).json({ mensagem: erroArea });
    }

    const usuarioExiste = await User.findOne({ email });

    if (usuarioExiste) {
      return res.status(400).json({ mensagem: "Já existe um usuário cadastrado com esse e-mail." });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = await User.create({
      nome,
      email,
      senha: senhaCriptografada,
      telefone,
      tipo,
      oab: tipo === "advogado" ? oab : "",
      areaAtuacao: tipo === "advogado" ? areaAtuacao : "",
      cidade: cidade || "",
      estado: estado || "",
      descricao: descricao || "",
      oabValidada: tipo === "advogado"
    });

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso.",
      usuario: novoUsuario
    });
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro ao cadastrar usuário.", erro: erro.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await User.findOne({ email });

    if (!usuario) {
      return res.status(401).json({ mensagem: "E-mail ou senha inválidos." });
    }

    const senhaConfere = await bcrypt.compare(senha, usuario.senha);

    if (!senhaConfere) {
      return res.status(401).json({ mensagem: "E-mail ou senha inválidos." });
    }

    const token = jwt.sign(
      { id: usuario._id, tipo: usuario.tipo },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      mensagem: "Login realizado com sucesso.",
      token,
      usuario
    });
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro ao fazer login.", erro: erro.message });
  }
});

router.get("/me", autenticar, async (req, res) => {
  return res.json({ usuario: req.usuario });
});

export default router;
