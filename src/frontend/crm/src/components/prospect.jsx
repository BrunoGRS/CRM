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

  const criarProspect = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/cliente/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        toast.success("Prospect criado com sucesso!");
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
        fetchProspect();
        setMostrarFormulario(false);
      } else {
        toast.error("Erro ao criar prospects");
      }
    } catch {
      toast.error("Erro ao criar prospects");
    }
  };

  const fetchProspect = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/cliente/listar");
      const inf = await response.json();
      const listaProdutos = Array.isArray(inf.msg) ? inf.msg : [];
      setProspects(listaProdutos);
    } catch {
      toast.error("Erro ao listar prospects");
    }
  };

  useEffect(() => {
    fetchProspect();
  }, []);

  // Excluir
  const excluirProspect = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/cliente/delete/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        toast.success("Prospect deletado com sucesso!");
        fetchProspect();
      } else {
        toast.error("Erro ao deletar Prospect");
      }
    } catch {
      toast.error("Erro ao deletar Prospect");
    }
  };

  // Editar
  const editarProspect = async (e, id) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/api/cliente/editar/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.status === 200) {
        toast.success("Prospect atualizado com sucesso!");
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
        setBotao(true);
        fetchProspect();
        setMostrarFormulario(false);
      } else {
        toast.error("Erro ao atualizar Prospect");
      }
    } catch {
      toast.error("Erro ao atualizar Prospect");
    }
  };

  return (
    <div className="layout">
      <Navbar />
      <main className="content">
        <h2>Gerenciamento de Prospect</h2>

        {/* Botão principal */}
        {!mostrarFormulario && (
          <button
            className="btn-criar-novo"
            onClick={() => {
              setMostrarFormulario(true);
              setBotao(true);
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
            }}
          >
            + Criar Novo Prospect
          </button>
        )}

        {/* Formulário aparece apenas quando clicar */}
        {mostrarFormulario && (
          <form
            className="produto-form"
            onSubmit={
              botao ? criarProspect : (e) => editarProspect(e, IdProspect)
            }
          >
            <input
              type="text"
              placeholder="CNPJ/CPF"
              value={formData.cnpj_cpf}
              onChange={(e) =>
                setFormData({ ...formData, cnpj_cpf: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Nome do Contato"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome_contato: e.target.value })
              }
              required
            />
            <input
              type="text"
              step="0.01"
              placeholder="Nome Fantasia"
              value={formData.fantasiaEmpresa}
              onChange={(e) =>
                setFormData({ ...formData, fantasiaEmpresa: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Razão Social"
              value={formData.razaoSocialEmpresa}
              onChange={(e) =>
                setFormData({ ...formData, razaoSocialEmpresa: e.target.value })
              }
              required
            />
            <input
              type="email"
              placeholder="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <input
              type="Number"
              placeholder="Telefone"
              value={formData.telefone}
              onChange={(e) =>
                setFormData({ ...formData, telefone: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Telefone"
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
              type="Number"
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
