import React, { useState, useEffect } from "react";
import "./css/venda.css";
import { Navbar } from "./navbar.jsx";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export function EditarVenda() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const [venda, setVenda] = useState({
    cliente_id: "",
    observacao: "",
    valor_total: 0,
  });

  const [itens, setItens] = useState([]);

  // ============================
  // BUSCA CLIENTES / PRODUTOS
  // ============================
  const fetchClientes = async () => {
    try {
      const resp = await fetch("http://localhost:3000/api/cliente/listar");
      const data = await resp.json();
      setClientes(Array.isArray(data.msg) ? data.msg : []);
    } catch {
      toast.error("Erro ao buscar clientes");
    }
  };

  const fetchProdutos = async () => {
    try {
      const resp = await fetch("http://localhost:3000/api/produto/listar");
      const data = await resp.json();
      setProdutos(Array.isArray(data.msg) ? data.msg : []);
    } catch {
      toast.error("Erro ao buscar produtos");
    }
  };

  // ============================
  // BUSCA VENDA
  // ============================
  const fetchVenda = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/venda/visualizar/${id}`
      );
      const data = await response.json();

      if (!data || !data.msg) {
        toast.error("Venda não encontrada");
        navigate("/venda");
        return;
      }

      setVenda({
        cliente_id: data.msg.cliente_id,
        observacao: data.msg.observacao || "",
        valor_total: data.msg.valor_total || 0,
      });
    } catch {
      toast.error("Erro ao buscar venda");
    }
  };

  // ============================
  // BUSCA ITENS DA VENDA
  // ============================
  const fetchItens = async () => {
    try {
      const resp = await fetch(
        `http://localhost:3000/api/item/item-venda/listar/${id}`
      );
      const data = await resp.json();
      setItens(data.itens || []);
    } catch (e) {
      toast.error("Erro ao buscar itens da venda");
    }
  };

  useEffect(() => {
    fetchClientes();
    fetchProdutos();
    fetchVenda();
    fetchItens();
  }, []);

  // ============================
  // CALCULA TOTAL AUTOMATICAMENTE
  // ============================
  useEffect(() => {
    const total = itens.reduce(
      (acc, item) => acc + parseFloat(item.subtotal),
      0
    );
    setVenda((prev) => ({ ...prev, valor_total: total.toFixed(2) }));
  }, [itens]);

  // ============================
  // EDITAR VENDA (CLIENTE + OBS)
  // ============================
  const salvarVenda = async () => {
    try {
      await fetch(`http://localhost:3000/api/venda/editar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venda),
      });
    } catch {
      toast.error("Erro ao salvar dados da venda");
    }
  };

  // ============================
  // ADICIONAR UM NOVO ITEM
  // ============================
  const adicionarItem = () => {
    setItens([
      ...itens,
      {
        id: null,
        produto_id: "",
        quantidade: 1,
        valor_unitario: 0,
        subtotal: 0,
        novo: true,
      },
    ]);
  };

  // ============================
  // ATUALIZA OS CAMPOS DO ITEM
  // ============================
  const atualizarItem = (index, campo, valor) => {
    const lista = [...itens];

    lista[index][campo] = valor;

    const qtd = parseFloat(lista[index].quantidade || 0);
    const vu = parseFloat(lista[index].valor_unitario || 0);

    lista[index].subtotal = qtd * vu;

    setItens(lista);
  };

  // ============================
  // SALVAR ITENS NO BACK-END
  // ============================
  const salvarItens = async () => {
    for (const item of itens) {
      // Criar novo item
      if (item.novo) {
        await fetch("http://localhost:3000/api/item/item-venda/criar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            venda_id: id,
            itens: [
              {
                produto_id: item.produto_id,
                quantidade: item.quantidade,
                valor_unitario: item.valor_unitario,
              },
            ],
          }),
        });
      } else {
        // Editar item existente
        await fetch(
          `http://localhost:3000/api/item/item-venda/editar/${item.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              produto_id: item.produto_id,
              quantidade: item.quantidade,
              valor_unitario: item.valor_unitario,
            }),
          }
        );
      }
    }
  };

  // ============================
  // EXCLUI ITEM
  // ============================
  const excluirItem = async (itemId) => {
    if (!window.confirm("Deseja remover este item?")) return;

    await fetch(`http://localhost:3000/api/item/item-venda/delete/${itemId}`, {
      method: "DELETE",
    });

    fetchItens();
  };

  // ============================
  // SALVAR TUDO
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    await salvarVenda();
    await salvarItens();

    toast.success("Venda atualizada!");
    navigate("/venda");
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
              name="cliente_id"
              value={venda.cliente_id}
              onChange={(e) =>
                setVenda({ ...venda, cliente_id: e.target.value })
              }
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

          {/* ITENS DA VENDA */}
          <h3>Itens da Venda</h3>

          {itens.map((item, index) => (
            <div key={index} className="item-linha">
              {/* PRODUTO */}
              <select
                value={item.produto_id}
                onChange={(e) =>
                  atualizarItem(index, "produto_id", e.target.value)
                }
                required
              >
                <option value="">Produto</option>
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>

              {/* QUANTIDADE */}
              <input
                type="number"
                value={item.quantidade}
                onChange={(e) =>
                  atualizarItem(index, "quantidade", e.target.value)
                }
                min="1"
              />

              {/* VALOR UNIT */}
              <input
                type="number"
                step="0.01"
                value={item.valor_unitario}
                onChange={(e) =>
                  atualizarItem(index, "valor_unitario", e.target.value)
                }
              />

              {/* SUBTOTAL */}
              <input
                type="text"
                readOnly
                value={Number(item.subtotal || 0).toFixed(2)}
              />

              {/* EXCLUIR */}
              {item.id && (
                <button
                  type="button"
                  className="btn-delete-item"
                  onClick={() => excluirItem(item.id)}
                >
                  ❌
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="btn-adicionar-item"
            onClick={adicionarItem}
          >
            ➕ Adicionar Item
          </button>

          {/* OBSERVAÇÃO */}
          <div className="form-group">
            <label>Observação:</label>
            <textarea
              value={venda.observacao}
              onChange={(e) =>
                setVenda({ ...venda, observacao: e.target.value })
              }
            />
          </div>

          {/* TOTAL */}
          <div className="form-group">
            <label>Total (R$):</label>
            <input type="text" value={venda.valor_total} readOnly />
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
