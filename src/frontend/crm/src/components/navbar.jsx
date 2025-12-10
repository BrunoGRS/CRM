import "./css/navbar.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/mini-logo.jpg";

export function Navbar() {
  const navigate = useNavigate();
  const codigoPermissao = localStorage.getItem("codigoPermissao");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const mapaPermissoes = {
    1: [
      "home",
      "usuarios",
      "prospect",
      "produtos",
      "contrato",
      "alocacao",
      "manutencao",
    ], // Admin
    3: ["home", "manutencao"], // Manutenção
    2: ["home", "contrato"], // Contrato
  };

  const temPermissao = (rota) => {
    return mapaPermissoes[codigoPermissao]?.includes(rota);
  };

  return (
    <section className="navbar-container">
      <div className="logo">
        <Link to="/home">
          <img src={logo} alt="Brastália logo" />
        </Link>
      </div>

      <nav>
        <ul className="nav-links">
          {temPermissao("home") && (
            <li>
              <Link to="/home">Inicio</Link>
            </li>
          )}

          {temPermissao("usuarios") && (
            <li>
              <Link to="/usuarios">Usuarios</Link>
            </li>
          )}

          {temPermissao("prospect") && (
            <li>
              <Link to="/prospect">Prospect</Link>
            </li>
          )}

          {temPermissao("produtos") && (
            <li>
              <Link to="/produtos">Produtos</Link>
            </li>
          )}

          {temPermissao("contrato") && (
            <li>
              <Link to="/contrato">Contratos</Link>
            </li>
          )}

          {temPermissao("alocacao") && (
            <li>
              <Link to="/alocacao">Alocações</Link>
            </li>
          )}

          {temPermissao("manutencao") && (
            <li>
              <Link to="/manutencao">Manutenções</Link>
            </li>
          )}
        </ul>
      </nav>

      <button className="btn-logout" onClick={logout}>
        Sair
      </button>
    </section>
  );
}
