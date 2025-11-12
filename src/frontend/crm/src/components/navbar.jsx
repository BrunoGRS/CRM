import "./css/navbar.css";
import { Link } from "react-router-dom";
import logo from "../assets/mini-logo.jpg";

export function Navbar() {
  return (
    // Adicione a classe aqui!
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
            <Link to="/alocacoes">Alocações</Link>
          </li>
          <li>
            <Link to="/manutencoes">Manutenções</Link>
          </li>
        </ul>
      </nav>
    </section>
  );
}
