import "./css/navbar.css";
import { Link } from "react-router-dom";
import logo from "../assets/mini-logo.jpg";

export function Navbar() {
  return (
    <section>
      <style src="./css/Navbar.css"></style>
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="mini-logo" />
        </div>
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
            <Link to="/produtos">Venda</Link>
          </li>
          <li>
            <Link to="/produtos">Alocações</Link>
          </li>
          <li>
            <Link to="/produtos">Manutenções</Link>
          </li>
        </ul>
      </nav>
    </section>
  );
}
