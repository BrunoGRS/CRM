import { useEffect, useState } from "react";
import { Navbar } from "./navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./css/novaAlocacao.css";

export default function AlocacaoCriar() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // ENDEREÇO
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");

  const [form, setForm] = useState({
    maquina_id: "",
    cliente_id: "",
    data_inicio: "",
    data_fim: "",
    status: "",
    local_instalacao: "",
    responsavel_instalacao: "",
    observacoes: "",
  });

  // BUSCAR CEP
  const buscarCEP = async (valor) => {
    const somenteNumeros = valor.replace(/\D/g, "");
    if (somenteNumeros.length === 8) {
      const response = await fetch(
        `https://viacep.com.br/ws/${somenteNumeros}/json/`
      );
      const data = await response.json();

      if (!data.erro) {
        setLogradouro(data.logradouro || "");
        setBairro(data.bairro || "");
        setCidade(data.localidade || "");
        setUf(data.uf || "");
      }
    }
  };

  async function fetchUsuarios() {
    try {
      const resp = await fetch("http://localhost:3000/api/usuario/listar");
      const data = await resp.json();
      if (Array.isArray(data.msg)) setUsuarios(data.msg);
    } catch (err) {
      toast.error("Erro ao carregar usuários");
    }
  }

  const fetchClientes = async () => {
    try {
      const resp = await fetch("http://localhost:3000/api/cliente/listar");
      const data = await resp.json();
      setClientes(Array.isArray(data.msg) ? data.msg : []);
    } catch {
      toast.error("Erro ao carregar clientes");
    }
  };

  const fetchProdutos = async () => {
    try {
      const resp = await fetch("http://localhost:3000/api/produto/listar");
      const data = await resp.json();
      setProdutos(Array.isArray(data.msg) ? data.msg : []);
    } catch {
      toast.error("Erro ao carregar máquinas/produtos");
    }
  };

  useEffect(() => {
    fetchClientes();
    fetchProdutos();
    fetchUsuarios();
  }, []);

  const gerarEnderecoUnico = () =>
    `${logradouro}, ${numero} - ${bairro} - ${cidade}/${uf}, CEP ${cep}`;

  const adicionarProduto = (id) => {
    if (!produtosSelecionados.includes(id)) {
      setProdutosSelecionados([...produtosSelecionados, id]);
    }
  };

  const removerProduto = (id) => {
    setProdutosSelecionados(produtosSelecionados.filter((p) => p !== id));
  };

  const salvar = async () => {
    const payload = {
      ...form,
      local_instalacao: gerarEnderecoUnico(),
      produtos: produtosSelecionados,
    };

    try {
      const resp = await fetch("http://localhost:3000/api/alocacao/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        toast.error("Erro ao salvar alocação");
        return;
      }

      toast.success("Alocação criada com sucesso!");
      navigate("/alocacao");
    } catch {
      toast.error("Erro ao salvar");
    }
  };

  return (
    <section className="aloc-container">
      <Navbar />

      <div className="aloc-form">
        {/* PRODUTO PRINCIPAL */}
        <label>Máquina / Produto</label>
        <select
          value={form.maquina_id}
          onChange={(e) => setForm({ ...form, maquina_id: e.target.value })}
        >
          <option value="">Selecione</option>
          {produtos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>

        {/* CLIENTE */}
        <label>Cliente</label>
        <select
          value={form.cliente_id}
          onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}
        >
          <option value="">Selecione</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.fantasiaEmpresa || c.razaoSocialEmpresa}
            </option>
          ))}
        </select>

        <label>Data Início</label>
        <input
          type="date"
          value={form.data_inicio}
          onChange={(e) => setForm({ ...form, data_inicio: e.target.value })}
        />

        <label>Data Fim</label>
        <input
          type="date"
          value={form.data_fim}
          onChange={(e) => setForm({ ...form, data_fim: e.target.value })}
        />

        <label>Status</label>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="">Selecione</option>
          <option value="ativa">Ativa</option>
          <option value="encerrada">Encerrada</option>
          <option value="em_manutencao">Em manutenção</option>
          <option value="reservada">Reservada</option>
        </select>

        {/* RESPONSÁVEL INSTALAÇÃO */}
        <label>Responsável Instalação</label>
        <select
          value={form.responsavel_instalacao}
          onChange={(e) =>
            setForm({ ...form, responsavel_instalacao: e.target.value })
          }
        >
          <option value="">Selecione</option>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nome}
            </option>
          ))}
        </select>

        {/* ENDEREÇO */}
        <div className="form-grid">
          <div>
            <label>CEP</label>
            <input
              type="text"
              value={cep}
              onChange={(e) => {
                setCep(e.target.value);
                buscarCEP(e.target.value);
              }}
            />
          </div>

          <div>
            <label>Logradouro</label>
            <input
              type="text"
              value={logradouro}
              onChange={(e) => setLogradouro(e.target.value)}
            />
          </div>

          <div>
            <label>Número</label>
            <input
              type="text"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />
          </div>

          <div>
            <label>Bairro</label>
            <input
              type="text"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </div>

          <div>
            <label>Cidade</label>
            <input
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />
          </div>

          <div>
            <label>UF</label>
            <input
              type="text"
              maxLength={2}
              value={uf}
              onChange={(e) => setUf(e.target.value.toUpperCase())}
            />
          </div>
        </div>

        {/* OBSERVAÇÕES */}
        <textarea
          value={form.observacoes}
          onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
        ></textarea>

        <div className="aloc-btns">
          <button className="btn-save" onClick={salvar}>
            Salvar
          </button>
          <button className="btn-cancel" onClick={() => navigate("/alocacao")}>
            Cancelar
          </button>
        </div>
      </div>
    </section>
  );
}
