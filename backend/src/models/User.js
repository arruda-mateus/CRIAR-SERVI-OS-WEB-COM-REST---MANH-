import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    senha: {
      type: String,
      required: true,
      minlength: 8
    },
    telefone: {
      type: String,
      required: true,
      trim: true
    },
    tipo: {
      type: String,
      enum: ["cliente", "advogado"],
      required: true
    },
    oab: {
      type: String,
      trim: true,
      default: ""
    },
    areaAtuacao: {
      type: String,
      trim: true,
      default: ""
    },
    cidade: {
      type: String,
      trim: true,
      default: ""
    },
    estado: {
      type: String,
      trim: true,
      default: ""
    },
    descricao: {
      type: String,
      trim: true,
      default: ""
    },
    oabValidada: {
      type: Boolean,
      default: false
    },
    avaliacao: {
      type: Number,
      default: 5
    }
  },
  {
    timestamps: true
  }
);

userSchema.methods.toJSON = function () {
  const usuario = this.toObject();
  delete usuario.senha;
  return usuario;
};

export default mongoose.model("User", userSchema);
