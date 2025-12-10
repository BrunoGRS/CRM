import React, { useState, useEffect } from "react";
import "./css/usuario.css";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Navbar } from "./navbar";
import MenuAcoes from "./menuAcoes";

export const Prospect = () => {
  const { id } = useParams();
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);
  const [prospects, setProspects] = useState([]);

  const [formData, setFormData] = useState({
    nome_contato: "",
    fantasiaEmpresa: "",
    razaoSocialEmpresa: "",
    email: "",
    telefone: "",
    status: "",
    cidade: "",
    bairro: "",
    ruaEndereco: "",
    numeroEndereco: "",
    complemento: "",
    cnpj_cpf: "",
  });

  const [botao, setBotao] = useState(true);
  const [IdProspect, setIdProspect] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // ============================
  // 🔹 PAGINAÇÃO CORRIGIDA
  // ============================
  const listaFiltrada = prospects; // pronto para futura busca/filtro

  const indexUltimo = paginaAtual * itensPorPagina;
  const indexPrimeiro = indexUltimo - itensPorPagina;

  const listaAtual = listaFiltrada.slice(indexPrimeiro, indexUltimo);

  const totalPaginas = Math.ceil(listaFiltrada.length / itensPorPagina);

  // FORMATADORES
  function formatCpfCnpj(value) {
    const onlyNumbers = value.replace(/\D/g, "");
    if (onlyNumbers.length <= 11) {
      return onlyNumbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      return onlyNumbers
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }
  }

  const onlyNumbers = (value) => value.replace(/\D/g, "");

  // 🔍 BUSCA CNPJ — BRASILAPI
  const buscarNaReceita = async () => {
    const cnpjNumerico = onlyNumbers(formData.cnpj_cpf);

    if (cnpjNumerico.length !== 14) {
      toast.error("Para consulta, informe um CNPJ válido!");
      return;
    }

    try {
      toast.info("Consultando dados do CNPJ...", { autoClose: 1800 });

      const response = await fetch(
        `https://brasilapi.com.br/api/cnpj/v1/${cnpjNumerico}`
      );

      if (!response.ok) {
        toast.error("CNPJ não encontrado ou API indisponível");
        return;
      }

      const data = await response.json();

      setFormData({
        ...formData,
        razaoSocialEmpresa: data.razao_social || "",
        fantasiaEmpresa: data.nome_fantasia || "",
        email: data.email || "",
        telefone: data.telefone || "",
        cidade: data.municipio || "",
        bairro: data.bairro || "",
        ruaEndereco: data.logradouro || "",
        numeroEndereco: data.numero || "",
        complemento: data.complemento || "",
      });

      toast.success("Dados importados com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao consultar BrasilAPI");
    }
  };

  const criarProspect = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        cnpj_cpf: onlyNumbers(formData.cnpj_cpf),
      };

      const response = await fetch("http://localhost:3000/api/cliente/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 201) {
        limparFormulario();
        fetchProspect();
        setMostrarFormulario(false);
        toast.success("Prospect criado com sucesso!");
      } else {
        toast.error("Erro ao criar prospect");
      }
    } catch {
      toast.error("Erro ao criar prospect");
    }
  };

  const limparFormulario = () => {
    setFormData({
      nome_contato: "",
      fantasiaEmpresa: "",
      razaoSocialEmpresa: "",
      email: "",
      telefone: "",
      status: "",
      cidade: "",
      bairro: "",
      ruaEndereco: "",
      numeroEndereco: "",
      complemento: "",
      cnpj_cpf: "",
    });
  };

  const exportarCSV = () => {
    if (!prospects || prospects.length === 0) {
      alert("Nenhum prospect encontrado para exportar.");
      return;
    }

    const cabecalho = [
      "Nome Contato",
      "Fantasia Empresa",
      "Razão Social",
      "E-mail",
      "Telefone",
      "Status",
      "Cidade",
      "Bairro",
      "Rua",
      "Número",
      "Complemento",
      "CNPJ/CPF",
    ];

    const linhas = prospects.map((item) => [
      item.nome_contato || "",
      item.fantasiaEmpresa || "",
      item.razaoSocialEmpresa || "",
      item.email || "",
      item.telefone || "",
      item.status || "",
      item.cidade || "",
      item.bairro || "",
      item.ruaEndereco || "",
      item.numeroEndereco || "",
      item.complemento || "",
      item.cnpj_cpf || "",
    ]);

    const csvString = [cabecalho, ...linhas]
      .map((linha) => linha.map((col) => `"${col}"`).join(","))
      .join("\n");

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "prospects.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchProspect = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/cliente/listar");
      const inf = await response.json();
      const lista = Array.isArray(inf.msg) ? inf.msg : [];
      setProspects(lista);
    } catch {
      toast.error("Erro ao listar prospects");
    }
  };

  useEffect(() => {
    fetchProspect();
  }, []);

  const excluirProspect = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/cliente/delete/${id}`,
        { method: "DELETE", headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        toast.success("Prospect deletado com sucesso!");
        fetchProspect();
      } else {
        toast.error("Erro ao deletar prospect");
      }
    } catch {
      toast.error("Erro ao deletar prospect");
    }
  };

  const editarProspect = async (e, id) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        cnpj_cpf: onlyNumbers(formData.cnpj_cpf),
      };

      const response = await fetch(
        `http://localhost:3000/api/cliente/editar/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.status === 200) {
        toast.success("Prospect atualizado com sucesso!");
        limparFormulario();
        setBotao(true);
        fetchProspect();
        setMostrarFormulario(false);
      } else {
        toast.error("Erro ao atualizar prospect");
      }
    } catch {
      toast.error("Erro ao atualizar prospect");
    }
  };

  return (
    <div className="layout">
      <Navbar />
      <main className="content">
        <h2>Gerenciamento de Prospect</h2>

        <button
          className="btn-criar-novo"
          onClick={() => {
            setMostrarFormulario(true);
            setBotao(true);
            limparFormulario();
          }}
        >
          + Criar Novo Prospect
        </button>

        <button className="btn-exportar" onClick={exportarCSV}>
          📄 Exportar CSV
        </button>

        {mostrarFormulario && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>{botao ? "Novo Prospect" : "Editar Prospect"}</h3>

              <form
                className="produto-form"
                onSubmit={
                  botao ? criarProspect : (e) => editarProspect(e, IdProspect)
                }
              >
                <div className="linha-cnpj">
                  <input
                    type="text"
                    placeholder="CPF/CNPJ"
                    value={formData.cnpj_cpf}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cnpj_cpf: formatCpfCnpj(e.target.value),
                      })
                    }
                    maxLength={18}
                    required
                  />

                  <button
                    type="button"
                    className="btn-receita"
                    onClick={buscarNaReceita}
                  >
                    Buscar Receita
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Nome do Contato"
                  value={formData.nome_contato}
                  onChange={(e) =>
                    setFormData({ ...formData, nome_contato: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Nome Fantasia"
                  value={formData.fantasiaEmpresa}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fantasiaEmpresa: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Razão Social"
                  value={formData.razaoSocialEmpresa}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      razaoSocialEmpresa: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Telefone"
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData({ ...formData, telefone: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Cidade"
                  value={formData.cidade}
                  onChange={(e) =>
                    setFormData({ ...formData, cidade: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Bairro"
                  value={formData.bairro}
                  onChange={(e) =>
                    setFormData({ ...formData, bairro: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Rua/Avenida"
                  value={formData.ruaEndereco}
                  onChange={(e) =>
                    setFormData({ ...formData, ruaEndereco: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Número"
                  value={formData.numeroEndereco}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numeroEndereco: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Complemento"
                  value={formData.complemento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      complemento: e.target.value,
                    })
                  }
                />

                <div className="botoes-form">
                  <button type="submit">
                    {botao ? "Criar Prospect" : "Salvar Alterações"}
                  </button>
                  <button
                    type="button"
                    className="btn-cancelar"
                    onClick={() => setMostrarFormulario(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* LISTAGEM */}
        {listaAtual.length === 0 ? (
          <p>Nenhum Prospect encontrado.</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <td>CNPJ/CPF</td>
                <td>Razão Social</td>
                <td>Email</td>
                <td>Telefone</td>
                <td>Cidade</td>
                <td>Bairro</td>
                <td>Ações</td>
              </tr>
            </thead>
            <tbody>
              {listaAtual.map((p) => (
                <tr key={p.id}>
                  <td>{p.cnpj_cpf}</td>
                  <td>{p.razaoSocialEmpresa}</td>
                  <td>{p.email}</td>
                  <td>{p.telefone}</td>
                  <td>{p.cidade}</td>
                  <td>{p.bairro}</td>

                  <td>
                    <MenuAcoes
                      onEditar={() => {
                        setFormData({
                          nome_contato: p.nome_contato || "",
                          fantasiaEmpresa: p.fantasiaEmpresa || "",
                          razaoSocialEmpresa: p.razaoSocialEmpresa,
                          email: p.email || "",
                          telefone: p.telefone || "",
                          status: p.status,
                          cidade: p.cidade || "",
                          bairro: p.bairro || "",
                          ruaEndereco: p.ruaEndereco || "",
                          numeroEndereco: p.numeroEndereco || "",
                          complemento: p.complemento || "",
                          cnpj_cpf: p.cnpj_cpf,
                        });
                        setBotao(false);
                        setIdProspect(p.id);
                        setMostrarFormulario(true);
                      }}
                      onExcluir={() => excluirProspect(p.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* PAGINAÇÃO */}
        <div className="paginacao-container">
          <button
            onClick={() => setPaginaAtual(paginaAtual - 1)}
            disabled={paginaAtual === 1}
            className="btn-paginacao"
          >
            Anterior
          </button>

          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i + 1}
              className={`btn-paginacao ${
                paginaAtual === i + 1 ? "ativo" : ""
              }`}
              onClick={() => setPaginaAtual(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPaginaAtual(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
            className="btn-paginacao"
          >
            Próximo
          </button>
        </div>
      </main>
    </div>
  );
};

export default Prospect;
