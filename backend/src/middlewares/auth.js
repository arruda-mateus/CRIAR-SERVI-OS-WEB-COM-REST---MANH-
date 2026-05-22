import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function autenticar(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ mensagem: "Token não informado." });
    }

    const [, token] = authHeader.split(" ");

    if (!token) {
      return res.status(401).json({ mensagem: "Token inválido." });
    }

    const dados = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await User.findById(dados.id);

    if (!usuario) {
      return res.status(401).json({ mensagem: "Usuário não encontrado." });
    }

    req.usuario = usuario;
    next();
  } catch (erro) {
    return res.status(401).json({ mensagem: "Sessão inválida ou expirada." });
  }
}

export function permitirTipos(tipos) {
  return (req, res, next) => {
    if (!tipos.includes(req.usuario.tipo)) {
      return res.status(403).json({ mensagem: "Acesso não permitido para este tipo de usuário." });
    }

    next();
  };
}
