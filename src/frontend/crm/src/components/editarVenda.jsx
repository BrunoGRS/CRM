// EditarVenda.jsx
import React, { useState, useEffect } from "react";
import "./css/editarVenda.css";
import { Navbar } from "./navbar.jsx";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export function EditarVenda() {
  const { id } = useParams(); // id da venda
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const [venda, setVenda] = useState({
    cliente_id: "",
    observacao: "",
    valor_total: 0,
  });

  const [itens, setItens] = useState([]);
  const [itensExcluidos, setItensExcluidos] = useState([]); // ids a excluir
  const [loading, setLoading] = useState(false);

  const fetchJson = async (url, options = {}) => {
    const resp = await fetch(url, options);
    const data = await resp.json().catch(() => null);
    return { resp, data };
  };

  // fetch clientes/produtos
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

  // buscar venda + itens (unificado)
  const fetchVenda = async () => {
    if (!id) return;
    try {
      const { resp, data } = await fetchJson(
        `http://localhost:3000/api/venda/${id}`
      );
      if (!resp.ok) {
        toast.error("Venda não encontrada");
        navigate("/venda");
        return;
      }
      // data.venda (model) e data.itens (array)
      const v = data.msg;
      setVenda({
        cliente_id: v.cliente_id,
        observacao: v.observacao || "",
        valor_total: v.valor_total || 0,
      });

      const itensTratados = (data.msg.itens || []).map((it) => ({
        id: it.id,
        produto_id: it.produto_id,
        quantidade: Number(it.quantidade),
        valor_unitario: Number(it.valor_unitario),
      }));
      setItens(itensTratados);
      setItensExcluidos([]);
      console.log(data.msg.itens);
    } catch (err) {
      toast.error("Erro ao carregar venda");
    }
  };

  useEffect(() => {
    if (!id) return;
    const carregar = async () => {
      setLoading(true);
      await Promise.all([fetchClientes(), fetchProdutos()]);
      await fetchVenda();
      setLoading(false);
    };
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // recalcular total no front (apenas visual)
  useEffect(() => {
    const total = itens.reduce((acc, it) => acc + Number(it.subtotal || 0), 0);
    setVenda((prev) => ({ ...prev, valor_total: Number(total).toFixed(2) }));
  }, [itens]);

  // helpers de UI
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
    if (produto)
      atualizarItem(
        index,
        "valor_unitario",
        Number(produto.preco ?? produto.valor ?? 0)
      );
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

  // marcar item para exclusão (se já existente)
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

  // salvar venda (unificado): PUT /api/venda/salvar/:id
  const salvarTudo = async () => {
    try {
      const payload = {
        cliente_id: venda.cliente_id,
        vendedor_id: venda.vendedor_id ?? null,
        data_venda: new Date(),
        observacao: venda.observacao,
        valor_total: venda.valor_total,
        itens: itens.map((it) => ({
          id: it.id || null,
          produto_id: it.produto_id,
          quantidade: Number(it.quantidade),
          valor_unitario: Number(it.valor_unitario),
        })),
        itens_excluidos: itensExcluidos,
      };

      const { resp, data } = await fetchJson(
        `http://localhost:3000/api/venda/editar/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!resp.ok) {
        console.error("Erro salvar tudo:", data);
        toast.error(data?.msg || "Erro ao salvar venda");
        console.log(payload);
        return false;
      }

      // sucesso: recarrega e retorna true
      await fetchVenda();
      return true;
    } catch (err) {
      console.error("Erro salvarTudo:", err);
      toast.error("Erro ao salvar venda");
      return false;
    }
  };

  // excluir venda completa
  const excluirVenda = async () => {
    if (!window.confirm("Deseja excluir esta venda?")) return;
    try {
      const { resp } = await fetchJson(
        `http://localhost:3000/api/venda/delete/${id}`,
        { method: "DELETE" }
      );
      if (!resp.ok) {
        toast.error("Erro ao excluir venda");
        return;
      }
      toast.success("Venda excluída");
      navigate("/venda");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir venda");
    }
  };

  // submit do form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await salvarTudo();
    setLoading(false);
    if (ok) {
      toast.success("Venda atualizada!");
      navigate("/venda");
    }
  };

  return (
    <section>
      <Navbar />

      <section className="venda-container">
        <h2>✏️ Editar Venda</h2>

        <form className="venda-form" onSubmit={handleSubmit}>
          {/* CLIENTE */}
          <div className="form-group">
            <label>Cliente:</label>
            <select
              value={venda.cliente_id}
              onChange={(e) =>
                setVenda({ ...venda, cliente_id: e.target.value })
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
          <h3>Itens da Venda</h3>

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
              value={venda.observacao}
              onChange={(e) =>
                setVenda({ ...venda, observacao: e.target.value })
              }
            />
          </div>

          {/* Total */}
          <div className="form-group">
            <label>Total (R$):</label>
            <input type="text" value={venda.valor_total} readOnly />
          </div>

          {/* Botões */}
          <div className="botoes-acoes">
            <button className="btn-salvar" disabled={loading} type="submit">
              💾 {loading ? "Salvando..." : "Salvar Alterações"}
            </button>

            <button
              type="button"
              className="btn-voltar"
              onClick={() => navigate("/venda")}
            >
              ⬅️ Voltar
            </button>

            <button
              type="button"
              className="btn-excluir"
              onClick={excluirVenda}
              style={{ marginLeft: 8 }}
            >
              🗑️ Excluir Venda
            </button>
          </div>
        </form>
      </section>
    </section>
  );
}

export default EditarVenda;
