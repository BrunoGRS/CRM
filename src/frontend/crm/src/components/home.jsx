import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "./css/home.css";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";
import { Layout } from "lucide-react";

export const Home = () => {
  const [logado, setLogado] = useState(false);
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usuario: usuario,
            senha: senha,
          }),
        }
      );

      return response.status;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const login = async (e) => {
    e.preventDefault(); // evita submit padrão do form
    const status = await validarUsuario();
    if (status == 200) {
      setLogado(true);
      navigate("/page");
    } else {
      toast.error("Usuário ou Senha Inválidos.");
    }
  };

  return (
    <div className="container-fluid box-login">
      <div className="row">
        <div className="container">
          <div className="row">
            <div className="container-login">
              <h3>Entrar na sua conta</h3>
              <p>Digite suas credenciais para acessar</p>
              <form>
                <div className="mb-40">
                  <label className="form-label">Usuário</label>
                  <input
                    type="text"
                    name="usuario"
                    className="form-control"
                    placeholder="Digite seu usuário"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-70">
                  <label htmlFor="senha" className="form-label">
                    Senha
                  </label>
                  <input
                    type={mostrarSenha ? "text" : "password"}
                    name="senha"
                    className="form-control"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                  <span
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "38px",
                      cursor: "pointer",
                    }}
                  >
                    {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                </div>
                <button
                  className="btn btn-login"
                  onClick={login}
                  style={{ fontSize: "19px" }}
                >
                  Entrar
                </button>
                <div className="box-esqueceu">
                  <a href="#">Esqueceu sua senha?</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
