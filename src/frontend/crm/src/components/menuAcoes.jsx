import React, { useState, useRef, useEffect } from "react";
import "./css/menuAcoes.css";

function MenuAcoes({ onEditar, onExcluir, onPDF }) {
  const [aberto, setAberto] = useState(false);
  const menuRef = useRef();

  const toggleMenu = () => setAberto((s) => !s);

  // Fecha ao clicar fora
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setAberto(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="menu-acoes-container" ref={menuRef}>
      <button
        className="menu-acoes-btn"
        aria-label="Abrir menu de ações"
        onClick={toggleMenu}
      >
        ⋮
      </button>

      {aberto && (
        <div className="menu-acoes-dropdown" role="menu">
          <div
            className="menu-item"
            role="menuitem"
            onClick={() => {
              setAberto(false);
              onEditar && onEditar();
            }}
          >
            Editar
          </div>

          <div
            className="menu-item"
            role="menuitem"
            onClick={() => {
              setAberto(false);
              onExcluir && onExcluir();
            }}
          >
            Excluir
          </div>

          <div
            className="menu-item"
            role="menuitem"
            onClick={() => {
              setAberto(false);
              onPDF && onPDF();
            }}
          >
            Gerar PDF
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuAcoes;
