import React from "react";
import "./css/body.css";
import { Navbar } from "./navbar.jsx";
import logoBrasitalia from "../assets/logo brasitalia.jpg";
import banner from "../assets/banner.webp";

export function Body() {
  // Carrossel
  let currentSlideIndex = 0;

  function showSlide(index) {
    const slides = document.querySelectorAll(".carousel-slide");
    const dots = document.querySelectorAll(".dot");
    const slidesContainer = document.querySelector(".carousel-slides");

    if (index >= slides.length) currentSlideIndex = 0;
    if (index < 0) currentSlideIndex = slides.length - 1;

    slidesContainer.style.transform = `translateX(-${
      currentSlideIndex * 100
    }%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentSlideIndex);
    });
  }

  function moveSlide(direction) {
    currentSlideIndex += direction;
    showSlide(currentSlideIndex);
  }

  function currentSlide(index) {
    currentSlideIndex = index;
    showSlide(currentSlideIndex);
  }

  // Auto-play do carrossel
  setInterval(() => {
    currentSlideIndex++;
    showSlide(currentSlideIndex);
  }, 5000);

  // Smooth scroll para links internos
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Animação ao scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = "fadeInUp 0.8s ease-out";
        entry.target.style.opacity = "1";
      }
    });
  }, observerOptions);

  // Observar cards
  document
    .querySelectorAll(".about-card, .service-card, .product-card")
    .forEach((card) => {
      card.style.opacity = "0";
      observer.observe(card);
    });

  // Efeito parallax sutil no hero (removido para evitar transpasse)
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector(".hero");
    if (hero && scrolled < hero.offsetHeight) {
      const parallaxSpeed = 0.3;
      hero.style.backgroundPositionY = `${scrolled * parallaxSpeed}px`;
    }
  });
  return (
    <section className="body-container">
      <Navbar />
      <script src="./script.js"></script>
      {/* Banner Inicial */}
      <section className="hero" id="inicio">
        <div className="hero-content">
          <h1>Brasitália Cafés e Máquinas</h1>
          <p>
            Experiência premium em cada xícara. Qualidade, tradição e inovação
            em cafés especiais e equipamentos profissionais.
          </p>
          <a href="#contato" className="cta-button">
            Entre em Contato
          </a>
        </div>
      </section>

      {/* Sobre */}
      <section className="about" id="sobre">
        <div className="container">
          {/* Carrossel de Imagens */}
          <div className="carousel-container">
            <div className="carousel-slides">
              <div className="carousel-slide active">
                <img src={logoBrasitalia} alt="Eissenza Uno" />
              </div>
              <div className="carousel-slide">
                <img src={banner} alt="Cafés Especiais" />
              </div>
              <div className="carousel-slide">
                <img
                  src="imagens/cafe protagonista.jpg"
                  alt="Café Protagonista"
                />
              </div>
            </div>
            <button className="carousel-btn prev">‹</button>
            <button className="carousel-btn next">›</button>
            <div className="carousel-dots">
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>

          <h2 className="section-title">Sobre a Brasitália</h2>
          <hr />
          <p className="section-subtitle">
            Tradição e excelência no mercado de cafés especiais
          </p>

          <div className="about-content">
            <div className="about-card">
              <h3>Nossa História</h3>
              <p>
                Com anos de experiência no mercado, a Brasitália se consolidou
                como referência em cafés premium e equipamentos profissionais.
                Nossa paixão pelo café nos move a buscar sempre a excelência.
              </p>
            </div>
            <div className="about-card">
              <h3>Nossa Missão</h3>
              <p>
                Proporcionar experiências únicas através de cafés de alta
                qualidade e equipamentos tecnológicos, valorizando cada etapa da
                cadeia produtiva e o trabalho dos produtores.
              </p>
            </div>
            <div className="about-card">
              <h3>Nossos Valores</h3>
              <p>
                Qualidade, sustentabilidade, inovação e respeito. Acreditamos em
                relações transparentes com produtores e clientes, promovendo o
                desenvolvimento sustentável do setor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="services" id="servicos">
        <div className="container">
          <h2 className="section-title">Nossos Serviços</h2>
          <hr />
          <p className="section-subtitle">
            Soluções completas para seu negócio
          </p>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-card-content">
                <h3>Microlotes Premium</h3>
                <p>
                  Cafés especiais cuidadosamente selecionados de pequenos
                  produtores, com rastreabilidade e perfis sensoriais únicos.
                </p>
              </div>
            </div>

            <div className="service-card">
              <div className="service-card-content">
                <h3>Equipamentos Profissionais</h3>
                <p>
                  Máquinas de café expresso, moedores e acessórios de alta
                  performance para cafeterias e empresas.
                </p>
              </div>
            </div>

            <div className="service-card">
              <div className="service-card-content">
                <h3>Consultoria e Treinamento</h3>
                <p>
                  Capacitação de baristas e consultoria para implantação de
                  cafeterias, com foco em qualidade e rentabilidade.
                </p>
              </div>
            </div>

            <div className="service-card">
              <div className="service-card-content">
                <h3>Distribuição</h3>
                <p>
                  Logística eficiente para atender desde pequenas cafeterias até
                  grandes redes, garantindo frescor e qualidade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Produtos */}
      <section className="products" id="produtos">
        <div className="container">
          <h2 className="section-title">Nossos Produtos</h2>
          <hr />
          <p className="section-subtitle">Qualidade em cada categoria</p>

          <div className="products-grid">
            <div className="product-card">
              <div className="product-image">
                <img src="imagens/opa.png" alt="Microlotes" />
              </div>
              <div className="product-info">
                <h3>Microlotes</h3>
                <hr />
                <p>
                  Cafés especiais de pequenos lotes com características únicas,
                  pontuação acima de 80 pontos e certificações de origem.
                </p>
                <span className="product-tag">Premium</span>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image">
                <img src="imagens/sublime.jpg" alt="Mais Vendidos" />
              </div>
              <div className="product-info">
                <h3>Mais Vendidos</h3>
                <hr />
                <p>
                  Blends equilibrados e cafés que conquistaram o paladar de
                  nossos clientes, com excelente custo-benefício.
                </p>
                <span className="product-tag">Destaque</span>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image">
                <img src="imagens/cafeteira.jpg" alt="Equipamentos" />
              </div>
              <div className="product-info">
                <h3>Equipamentos</h3>
                <hr />
                <p>
                  Máquinas de espresso profissionais, moedores de precisão e
                  acessórios das melhores marcas do mercado.
                </p>
                <span className="product-tag">Profissional</span>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image">
                <img src="imagens/premium.jpg" alt="Bebidas Premium" />
              </div>
              <div className="product-info">
                <h3>Bebidas Premium</h3>
                <hr />
                <p>
                  Nosso Chocolate Europeu Meio Amargo - 35% Cacau combina mais
                  cacau e mais saúde em uma bebida rica e equilibrada, com sabor
                  intenso e levemente adoçado.
                </p>
                <span className="product-tag">Premium</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section className="contact" id="contato">
        <div className="container">
          <h2>Entre em Contato</h2>
          <p>Estamos prontos para atender você e seu negócio</p>

          <div className="contact-info">
            <div className="contact-item">
              <strong>📧 Email:</strong> brasitalia@brasitaliacafe.com.br
            </div>
            <div className="contact-item">
              <strong>📱 Telefone:</strong> (49) 3329-3680
            </div>
            <div className="contact-item">
              <strong>📍 Endereço:</strong>
              <p>
                Brasitália Café | CNPJ: 02.837.091/0001-40
                <br />
                Av. Nereu Ramos, 747-E, Centro, Chapecó/SC - CEP: 89801-021.
              </p>
              <hr />
              <p>
                Em breve: Rua Cyro Belli Muller 54, Santa Mônica, Florianópolis
                (Filial)
              </p>
              <p>© Direitos Reservados — www.brasitaliacafe.com.br</p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
