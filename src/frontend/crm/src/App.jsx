import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./components/login.jsx";
import { Usuarios } from "./components/usuario.jsx";
import { Body } from "./components/body.jsx";
import { Produtos } from "./components/produtos.jsx";
import { Prospect } from "./components/prospect.jsx";
import { RegistroVenda } from "./components/venda.jsx";
import { ListarVendas } from "./components/listarVendas.jsx";
import { EditarVenda } from "./components/editarVenda.jsx";
import Alocacao from "./components/alocacao.jsx";
import NovaALocacao from "./components/novaAlocacao.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Body />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/prospect" element={<Prospect />} />
        <Route path="/venda" element={<ListarVendas />} />
        <Route path="/venda/nova" element={<RegistroVenda />} />
        <Route path="/venda/editar/:id" element={<EditarVenda />} />
        <Route path="/alocacao" element={<Alocacao />} />
        <Route path="/alocacao/nova" element={<NovaALocacao />} />
      </Routes>
    </Router>
  );
}

export default App;
