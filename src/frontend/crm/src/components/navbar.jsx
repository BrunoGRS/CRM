import "./css/navbar.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/mini-logo.jpg";

export function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("auth"); // remove sessão
    navigate("/"); // volta para login
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
          <li>
            <Link to="/home">Inicio</Link>
          </li>
          <li>
            <Link to="/usuarios">Usuarios</Link>
          </li>
          <li>
            <Link to="/prospect">Prospect</Link>
          </li>
          <li>
            <Link to="/produtos">Produtos</Link>
          </li>
          <li>
            <Link to="/venda">Venda</Link>
          </li>
          <li>
            <Link to="/alocacao">Alocações</Link>
          </li>
          <li>
            <Link to="/manutencao">Manutenções</Link>
          </li>
        </ul>
      </nav>

      {/* 🔹 Botão de Logout */}
      <button className="btn-logout" onClick={logout}>
        Sair
      </button>
    </section>
  );
}
