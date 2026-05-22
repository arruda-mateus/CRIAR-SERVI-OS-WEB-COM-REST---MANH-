import mongoose from "mongoose";

const solicitacaoSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    advogado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    area: {
      type: String,
      required: true,
      trim: true
    },
    descricao: {
      type: String,
      required: true,
      trim: true,
      minlength: 10
    },
    status: {
      type: String,
      enum: ["pendente", "em andamento", "finalizada", "recusada"],
      default: "pendente"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Solicitacao", solicitacaoSchema);
