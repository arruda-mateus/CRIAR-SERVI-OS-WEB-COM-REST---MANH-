import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import solicitacaoRoutes from "./routes/solicitacaoRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensagem: "Backend do Vigia Jurídico funcionando." });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", projeto: "Vigia Jurídico" });
});

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/solicitacoes", solicitacaoRoutes);

if (!MONGO_URI) {
  console.log("Erro: variável MONGO_URI não encontrada no arquivo .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado com sucesso");
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((erro) => {
    console.log("Erro ao conectar no MongoDB", erro.message);
    process.exit(1);
  });
