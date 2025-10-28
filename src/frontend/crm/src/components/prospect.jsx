import React, { useState, useEffect } from "react";
import "./css/usuario.css";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Navbar } from "./navbar";

export const Prospect = () => {
  const { id } = useParams();
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
  const [value, setValue] = useState("");

  function formatCpfCnpj(value) {
    // Remove tudo que não é número
    const onlyNumbers = value.replace(/\D/g, "");

    // CPF: 11 dígitos, CNPJ: 14 dígitos
    if (onlyNumbers.length <= 11) {
      // Formata como CPF: 999.999.999-99
      return onlyNumbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      // Formata como CNPJ: 99.999.999/9999-99
      return onlyNumbers
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }
  }

  const onlyNumbers = (value) => value.replace(/\D/g, "");

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

        {/* Botão principal */}
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

        {/* Modal do formulário */}
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
                    setFormData({ ...formData, numeroEndereco: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Complemento"
                  value={formData.complemento}
                  onChange={(e) =>
                    setFormData({ ...formData, complemento: e.target.value })
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

        {prospects.length === 0 ? (
          <p>Nenhum Prospect encontrado.</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>CNPJ/CPF</th>
                <th>Razão Social</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Cidade</th>
                <th>Bairro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {prospects.map((p) => (
                <tr key={p.id}>
                  <td>{p.cnpj_cpf}</td>
                  <td>{p.razaoSocialEmpresa}</td>
                  <td>{p.email}</td>
                  <td>{p.telefone}</td>
                  <td>{p.cidade}</td>
                  <td>{p.bairro}</td>
                  <td>
                    <button
                      className="button-editar"
                      onClick={() => {
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
                    >
                      Editar
                    </button>
                    <button
                      className="button-excluir"
                      onClick={() => excluirProspect(p.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default Prospect;
