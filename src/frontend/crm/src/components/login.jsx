import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import "./css/login.css";

export const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

  const validarUsuario = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/usuario/validar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuario, senha }),
        }
      );
      return response.status;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const login = async (e) => {
    e.preventDefault();
    const status = await validarUsuario();

    if (status === 200) {
      localStorage.setItem("auth", "true"); // ← salva login
      navigate("/home");
    } else {
      toast.error("Usuário ou Senha Inválidos.");
    }
  };

  return (
    <div className="login-page-container">
      <div className="container-login">
        <h3>Entrar na sua conta</h3>
        <p>Digite suas credenciais para acessar</p>
        <form onSubmit={login}>
          <label className="form-label">Usuário</label>
          <input
            type="text"
            className="form-control"
            placeholder="Digite seu usuário"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />

          <label className="form-label">Senha</label>
          <div className="senha-container">
            <input
              type={mostrarSenha ? "text" : "password"}
              className="form-control"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <span
              className="toggle-senha"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <button type="submit" className="btn btn-login">
            Entrar
          </button>

          <div className="box-esqueceu">
            <a href="#">Esqueceu a Senha?</a>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};
