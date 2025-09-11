import React, { useState } from "react";
import Page from "./page.jsx";
import "./css/Layout.css";

export const Layout = () => {
  const [selectedMenu, setSelectedMenu] = useState("dashboard");

  const renderContent = () => {
    switch (selectedMenu) {
      case "usuarios":
        return <Page />;
      case "relatorios":
        return <h2>📊 Relatórios</h2>;
      case "config":
        return <h2>⚙️ Configurações</h2>;
      default:
        return <h2>🏠 Dashboard inicial</h2>;
    }
  };

  return (
    <section>
      {/* Bootstrap e fontes */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css"
        rel="stylesheet"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=Raleway:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Sidebar */}
      <div id="sidebar" className="sidebar">
        <div className="brand mb-3">
          <h4 className="m-0">CoffeeCRM</h4>
          <button className="toggle-btn" onClick={() => alert("futuramente toggle do sidebar")}>
            ☰
          </button>
        </div>

        <ul className="nav flex-column">
          <li className="nav-item">
            <a href="#" className="nav-link">
              🏠 <span>Inicial</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              🗺️ <span>Mapa</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              📅 <span>Agenda</span>
            </a>
          </li>
          <li className="nav-item">
              <a
                href="#"
                className="nav-link"
                onClick={() => setSelectedMenu("usuarios")}
              >
                👤 <span>Usuários</span>
              </a>
            </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              🏷️ <span>Marcas</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              📦 <span>Produtos</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              📊 <span>Estatísticas</span>
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#"
              className="nav-link"
              onClick={() => setSelectedMenu("relatorios")}
            >
              📑 <span>Relatórios</span>
            </a>
          </li>
        </ul>
      </div>

      {/* Área de conteúdo */}
      <div className="content p-3">{renderContent()}</div>
    </section>
  );
};

export default Layout;
