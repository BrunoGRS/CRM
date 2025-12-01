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
import { PrivateRoute } from "./components/PrivateRoute.jsx";
import { EditarAlocacao } from "./components/editarAlocacao.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        {/* ROTA PÚBLICA */}
        <Route path="/" element={<Login />} />

        {/* ROTAS PROTEGIDAS */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Body />
            </PrivateRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <PrivateRoute>
              <Usuarios />
            </PrivateRoute>
          }
        />

        <Route
          path="/produtos"
          element={
            <PrivateRoute>
              <Produtos />
            </PrivateRoute>
          }
        />

        <Route
          path="/prospect"
          element={
            <PrivateRoute>
              <Prospect />
            </PrivateRoute>
          }
        />

        <Route
          path="/venda"
          element={
            <PrivateRoute>
              <ListarVendas />
            </PrivateRoute>
          }
        />

        <Route
          path="/venda/nova"
          element={
            <PrivateRoute>
              <RegistroVenda />
            </PrivateRoute>
          }
        />

        <Route
          path="/venda/editar/:id"
          element={
            <PrivateRoute>
              <EditarVenda />
            </PrivateRoute>
          }
        />

        <Route
          path="/alocacao"
          element={
            <PrivateRoute>
              <Alocacao />
            </PrivateRoute>
          }
        />

        <Route
          path="/alocacao/nova"
          element={
            <PrivateRoute>
              <NovaALocacao />
            </PrivateRoute>
          }
        />

        <Route
          path="/alocacao/editar/:id"
          element={
            <PrivateRoute>
              <EditarAlocacao />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
