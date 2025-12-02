// EditarContrato.jsx
import React, { useState, useEffect } from "react";
import "./css/editarVenda.css";
import { Navbar } from "./navbar.jsx";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export function EditarContrato() {
  const { id } = useParams(); // id do contrato
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const [contrato, setContrato] = useState({
    cliente_id: "",
    observacao: "",
    valor_total: 0,
  });

  const [itens, setItens] = useState([]);
  const [itensExcluidos, setItensExcluidos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJson = async (url, options = {}) => {
    const resp = await fetch(url, options);
    const data = await resp.json().catch(() => null);
    return { resp, data };
  };

  const fetchClientes = async () => {
    try {
      const { resp, data } = await fetchJson(
        "http://localhost:3000/api/cliente/listar"
      );
      if (resp.ok && Array.isArray(data.msg)) setClientes(data.msg);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao buscar clientes");
    }
  };

  const fetchProdutos = async () => {
    try {
      const { resp, data } = await fetchJson(
        "http://localhost:3000/api/produto/listar"
      );
      if (resp.ok && Array.isArray(data.msg)) setProdutos(data.msg);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao buscar produtos");
    }
  };

  const fetchContrato = async () => {
    if (!id) return;
    try {
      const { resp, data } = await fetchJson(
        `http://localhost:3000/api/contrato/${id}`
      );

      if (!resp.ok) {
        toast.error("Contrato não encontrado");
        navigate("/contrato");
        return;
      }

      const c = data.msg;
      setContrato({
        cliente_id: c.cliente_id,
        observacao: c.observacao || "",
        valor_total: c.valor_total || 0,
      });

      const itensTratados = (data.msg.itens || []).map((it) => ({
        id: it.id,
        produto_id: it.produto_id,
        quantidade: Number(it.quantidade),
        valor_unitario: Number(it.valor_unitario),
      }));

      setItens(itensTratados);
      setItensExcluidos([]);
    } catch (err) {
      toast.error("Erro ao carregar contrato");
    }
  };

  useEffect(() => {
    if (!id) return;
    const carregar = async () => {
      setLoading(true);
      await Promise.all([fetchClientes(), fetchProdutos()]);
      await fetchContrato();
      setLoading(false);
    };
    carregar();
  }, [id]);

  useEffect(() => {
    const total = itens.reduce((acc, it) => acc + Number(it.subtotal || 0), 0);
    setContrato((prev) => ({ ...prev, valor_total: Number(total).toFixed(2) }));
  }, [itens]);

  const atualizarItem = (index, campo, valor) => {
    setItens((prev) => {
      const lista = [...prev];
      lista[index][campo] = valor;

      const qtd = Number(lista[index].quantidade || 0);
      const vu = Number(lista[index].valor_unitario || 0);

      lista[index].subtotal = Number((qtd * vu).toFixed(2));
      return lista;
    });
  };

  const handleSelectProduto = (index, produtoId) => {
    const produto = produtos.find((p) => String(p.id) === String(produtoId));
    atualizarItem(index, "produto_id", produtoId);
    if (produto) {
      atualizarItem(
        index,
        "valor_unitario",
        Number(produto.preco ?? produto.valor ?? 0)
      );
    }
  };

  const adicionarItem = () => {
    setItens((prev) => [
      ...prev,
      {
        id: null,
        produto_id: "",
        quantidade: 1,
        valor_unitario: 0,
        subtotal: 0,
      },
    ]);
  };

  const removerItem = (index) => {
    setItens((prev) => {
      const lista = [...prev];
      const item = lista[index];
      if (item && item.id) {
        setItensExcluidos((prevIds) => [...prevIds, item.id]);
      }
      lista.splice(index, 1);
      return lista;
    });
  };

  const salvarTudo = async () => {
    try {
      const payload = {
        cliente_id: contrato.cliente_id,
        data_contrato: new Date(),
        observacao: contrato.observacao,
        valor_total: contrato.valor_total,
        itens: itens.map((it) => ({
          id: it.id || null,
          produto_id: it.produto_id,
          quantidade: Number(it.quantidade),
          valor_unitario: Number(it.valor_unitario),
        })),
        itens_excluidos: itensExcluidos,
      };

      const { resp, data } = await fetchJson(
        `http://localhost:3000/api/contrato/editar/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!resp.ok) {
        toast.error(data?.msg || "Erro ao salvar contrato");
        return false;
      }

      await fetchContrato();
      return true;
    } catch (err) {
      console.error("Erro:", err);
      toast.error("Erro ao salvar contrato");
      return false;
    }
  };

  const excluirContrato = async () => {
    if (!window.confirm("Deseja excluir este contrato?")) return;

    try {
      const { resp } = await fetchJson(
        `http://localhost:3000/api/contrato/delete/${id}`,
        { method: "DELETE" }
      );

      if (!resp.ok) {
        toast.error("Erro ao excluir contrato");
        return;
      }

      toast.success("Contrato excluído");
      navigate("/contrato");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir contrato");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await salvarTudo();
    setLoading(false);
    if (ok) {
      toast.success("Contrato atualizado!");
      navigate("/contrato");
    }
  };

  return (
    <section>
      <Navbar />

      <section className="contrato-container">
        <h2>✏️ Editar Contrato</h2>

        <form className="contrato-form" onSubmit={handleSubmit}>
          {/* CLIENTE */}
          <div className="form-group">
            <label>Cliente:</label>
            <select
              value={contrato.cliente_id}
              onChange={(e) =>
                setContrato({ ...contrato, cliente_id: e.target.value })
              }
              required
            >
              <option value="">Selecione um cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.razaoSocialEmpresa || c.nome || `#${c.id}`}
                </option>
              ))}
            </select>
          </div>

          {/* ITENS */}
          <h3>Itens do Contrato</h3>

          {loading && <p>Carregando...</p>}

          {itens.length === 0 && !loading && (
            <p style={{ color: "#777" }}>Nenhum item. Use "Adicionar Item".</p>
          )}

          {itens.map((item, index) => (
            <div key={item.id ?? `novo-${index}`} className="item-linha">
              <select
                value={item.produto_id}
                onChange={(e) => handleSelectProduto(index, e.target.value)}
                required
              >
                <option value="">Produto</option>
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={item.quantidade}
                onChange={(e) =>
                  atualizarItem(index, "quantidade", e.target.value)
                }
              />

              <input
                type="number"
                step="0.01"
                value={item.valor_unitario}
                onChange={(e) =>
                  atualizarItem(index, "valor_unitario", e.target.value)
                }
              />

              <input
                type="text"
                readOnly
                value={Number(item.subtotal || 0).toFixed(2)}
              />

              <button
                type="button"
                className="btn-delete-item"
                onClick={() => removerItem(index)}
              >
                ❌
              </button>
            </div>
          ))}

          <button
            type="button"
            className="btn-adicionar-item"
            onClick={adicionarItem}
          >
            ➕ Adicionar Item
          </button>

          {/* Observação */}
          <div className="form-group">
            <label>Observação:</label>
            <textarea
              value={contrato.observacao}
              onChange={(e) =>
                setContrato({ ...contrato, observacao: e.target.value })
              }
            />
          </div>

          {/* Total */}
          <div className="form-group">
            <label>Total (R$):</label>
            <input type="text" value={contrato.valor_total} readOnly />
          </div>

          {/* Botões */}
          <div className="botoes-acoes">
            <button className="btn-salvar" disabled={loading} type="submit">
              💾 {loading ? "Salvando..." : "Salvar Alterações"}
            </button>

            <button
              type="button"
              className="btn-voltar"
              onClick={() => navigate("/contrato")}
            >
              ⬅️ Voltar
            </button>

            <button
              type="button"
              className="btn-excluir"
              onClick={excluirContrato}
              style={{ marginLeft: 8 }}
            >
              🗑️ Excluir Contrato
            </button>
          </div>
        </form>
      </section>
    </section>
  );
}

export default EditarContrato;
