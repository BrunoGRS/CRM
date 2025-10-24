import React from "react";
import "./css/body.css";
import { Link } from "react-router-dom";
import { Navbar } from "./navbar.jsx";

export function Body() {
  return (
    <section className="body-container">
      <Navbar />
      {/* Banner Inicial */}
      <section className="inicio">
        <div className="imagem-prof">
          <h2>Profissionais de Saúde Online</h2>
          <p>
            Encontre o atendimento ideal para você de forma rápida e segura.
          </p>
          <Link to="/profissionais">
            <button className="btn">Encontrar Agora</button>
          </Link>
        </div>
      </section>

      {/* Sobre Nós */}
      <section className="about-us">
        <div className="about-text">
          <h2>Sobre Nós</h2>
          <p>
            Nossa plataforma conecta você aos melhores médicos, psicólogos,
            fisioterapeutas e muitos outros profissionais da área da saúde.
            Garantimos qualidade, acessibilidade e facilidade no agendamento.
          </p>
          <p>
            Mais de <strong>10.000 atendimentos</strong> já realizados com
            satisfação comprovada!
          </p>
        </div>
        <div className="foto"></div>
      </section>

      {/* Como Funciona */}
      <section className="how-works">
        <div className="how-works-title">
          <h2>
            <span className="highlight">Como funciona nosso atendimento?</span>
          </h2>
        </div>
        <div className="how-works-text">
          <p>
            Nossa plataforma facilita a interação entre{" "}
            <span className="highlight-cliente">clientes</span> e{" "}
            <span className="highlight-prestador">profissionais de saúde</span>.
            Você pode:
          </p>
          <ul>
            <li>Pesquisar profissionais por especialidade ou localização;</li>
            <li>Visualizar avaliações e recomendações de outros usuários;</li>
            <li>Agendar consultas de forma simples e rápida;</li>
            <li>Participar de atendimentos online via vídeo ou chat.</li>
          </ul>
        </div>
      </section>

      {/* Benefícios */}
      <section className="benefits">
        <h2>Por que escolher a nossa plataforma?</h2>
        <div className="benefits-list">
          <div className="benefit-item">
            <h3>Atendimento Rápido</h3>
            <p>Agende consultas em poucos minutos, sem burocracia.</p>
          </div>
          <div className="benefit-item">
            <h3>Profissionais Qualificados</h3>
            <p>
              Trabalhamos apenas com especialistas verificados e com
              experiência.
            </p>
          </div>
          <div className="benefit-item">
            <h3>Flexibilidade de Horários</h3>
            <p>Escolha o melhor horário conforme sua disponibilidade.</p>
          </div>
        </div>
      </section>
    </section>
  );
}
