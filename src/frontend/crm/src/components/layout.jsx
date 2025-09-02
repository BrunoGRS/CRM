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
    <div className="app-layout">
      <aside className="sidebar">
        <h2 className="logo">Meu Sistema</h2>
        <nav>
          <ul>
            <li
              className={selectedMenu === "dashboard" ? "active" : ""}
              onClick={() => setSelectedMenu("dashboard")}
            >
              Dashboard
            </li>
            <li
              className={selectedMenu === "usuarios" ? "active" : ""}
              onClick={() => setSelectedMenu("usuarios")}
            >
              Usuários
            </li>
            <li
              className={selectedMenu === "relatorios" ? "active" : ""}
              onClick={() => setSelectedMenu("relatorios")}
            >
              Relatórios
            </li>
            <li
              className={selectedMenu === "config" ? "active" : ""}
              onClick={() => setSelectedMenu("config")}
            >
              Configurações
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">{renderContent()}</main>
    </div>
  );
};

export default Layout;
