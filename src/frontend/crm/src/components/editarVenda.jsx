import React, { useState, useEffect } from "react";
import "./css/venda.css";
import { Navbar } from "./navbar.jsx";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export function EditarVenda() {
  const { id } = useParams();
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [venda, setVenda] = useState({
    cliente_id: "",
    produto_id: "",
    quantidade: 1,
    valor_unitario: "",
    valor_total: "",
    observacao: "",
  });

  const navigate = useNavigate();

  // Atualiza o total automaticamente
  useEffect(() => {
    const total =
      parseFloat(venda.quantidade || 0) * parseFloat(venda.valor_unitario || 0);
    setVenda((prev) => ({ ...prev, valor_total: total.toFixed(2) }));
  }, [venda.quantidade, venda.valor_unitario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVenda({ ...venda, [name]: value });
  };

  // Busca clientes
  const fetchClientes = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/cliente/listar");
      const inf = await response.json();
      setClientes(Array.isArray(inf.msg) ? inf.msg : []);
    } catch {
      toast.error("Erro ao listar clientes");
    }
  };

  // Busca produtos
  const fetchProdutos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/produto/listar");
      const inf = await response.json();
      setProdutos(Array.isArray(inf.msg) ? inf.msg : []);
    } catch {
      toast.error("Erro ao listar produtos");
    }
  };

  // Busca venda pelo ID
  const fetchVenda = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/venda/${id}`);
      const data = await response.json();

      if (data && data.msg) {
        setVenda({
          cliente_id: data.msg.cliente_id,
          produto_id: data.msg.produto_id || "",
          quantidade: data.msg.quantidade || 1,
          valor_unitario: data.msg.valor_unitario || "",
          valor_total: data.msg.valor_total || "",
          observacao: data.msg.observacao || "",
        });
      } else {
        toast.error("Venda não encontrada");
        navigate("/venda");
      }
    } catch {
      toast.error("Erro ao buscar venda");
    }
  };

  useEffect(() => {
    fetchClientes();
    fetchProdutos();
    fetchVenda();
  }, []);

  // Atualizar venda
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      cliente_id: venda.cliente_id,
      produto_id: venda.produto_id,
      quantidade: venda.quantidade,
      valor_unitario: venda.valor_unitario,
      valor_total: venda.valor_total,
      observacao: venda.observacao,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/venda/editar/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.status === 200) {
        toast.success("Venda atualizada com sucesso!");
        navigate("/venda");
      } else {
        toast.error("Erro ao atualizar venda");
      }
    } catch {
      toast.error("Erro ao salvar alterações");
    }
  };

  return (
    <section>
      <Navbar />

      <section className="venda-container">
        <h2>✏️ Editar Venda</h2>

        <form className="venda-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Cliente:</label>
            <select
              name="cliente_id"
              value={venda.cliente_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.razaoSocialEmpresa}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Produto:</label>
            <select
              name="produto_id"
              value={venda.produto_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um produto</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="form-inline">
            <div className="form-group">
              <label>Quantidade:</label>
              <input
                type="number"
                name="quantidade"
                value={venda.quantidade}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Valor Unitário (R$):</label>
              <input
                type="number"
                name="valor_unitario"
                value={venda.valor_unitario}
                onChange={handleChange}
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Valor Total (R$):</label>
              <input type="text" value={venda.valor_total} readOnly />
            </div>
          </div>

          <div className="form-group">
            <label>Observação:</label>
            <textarea
              name="observacao"
              value={venda.observacao}
              onChange={handleChange}
              placeholder="Informações adicionais..."
            />
          </div>

          <div className="botoes-acoes">
            <button type="submit" className="btn-salvar">
              💾 Salvar Alterações
            </button>
            <button
              type="button"
              className="btn-voltar"
              onClick={() => navigate("/venda")}
            >
              ⬅️ Voltar
            </button>
          </div>
        </form>
      </section>
    </section>
  );
}

export default EditarVenda;
