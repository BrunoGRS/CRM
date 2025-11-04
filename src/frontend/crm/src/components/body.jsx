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
          <h2>CRM Brasitalia</h2>
          <p>
            Tecnologia e relacionamento unindo tradição e excelência no mercado de café.
          </p>
          <Link to="/clientes">
            <button className="btn">Acessar Plataforma</button>
          </Link>
        </div>
      </section>

      {/* Sobre o CRM */}
      <section className="about-us">
        <div className="about-text">
          <h2>Sobre o CRM</h2>
          <p>
            O CRM Brasitalia é uma plataforma desenvolvida para aprimorar a gestão de relacionamentos
            com clientes, distribuidores e parceiros da marca. 
          </p>
          <p>
            Integrando dados, comunicação e histórico de vendas, o sistema oferece uma visão completa do cliente
            e fortalece o compromisso da Brasitalia com qualidade e proximidade no atendimento.
          </p>
        </div>
        <div className="foto"></div>
      </section>

      {/* Como Funciona */}
      <section className="how-works">
        <div className="how-works-title">
          <h2>
            <span className="highlight">Como o CRM impulsiona a Brasitalia</span>
          </h2>
        </div>
        <div className="how-works-text">
          <p>
            A plataforma foi desenvolvida para integrar os processos de relacionamento e vendas,
            facilitando o trabalho de toda a equipe comercial. Com o CRM, é possível:
          </p>
          <ul>
            <li>Registrar informações detalhadas de clientes e contatos;</li>
            <li>Gerenciar pedidos, histórico e acompanhamento de vendas;</li>
            <li>Organizar oportunidades e tarefas da equipe comercial;</li>
            <li>Gerar relatórios estratégicos e indicadores de desempenho.</li>
          </ul>
        </div>
      </section>

      {/* Benefícios */}
      <section className="benefits">
        <h2>Principais Benefícios</h2>
        <div className="benefits-list">
          <div className="benefit-item">
            <h3>Gestão Integrada</h3>
            <p>
              Todos os dados centralizados em um único ambiente, facilitando a tomada de decisões.
            </p>
          </div>
          <div className="benefit-item">
            <h3>Produtividade e Eficiência</h3>
            <p>
              Automatiza tarefas e simplifica o fluxo de trabalho entre setores.
            </p>
          </div>
          <div className="benefit-item">
            <h3>Relacionamento Duradouro</h3>
            <p>
              Fortalece a conexão entre a Brasitalia e seus clientes, garantindo um atendimento personalizado e ágil.
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}
