import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./components/login.jsx";
import { Usuarios } from "./components/usuario.jsx";
import { Body } from "./components/body.jsx";
import { Produtos } from "./components/produtos.jsx";
import { Prospect } from "./components/prospect.jsx";
import { RegistroContrato } from "./components/contrato.jsx";
import { ListarContratos } from "./components/listarContratos.jsx";
import { EditarContrato } from "./components/editarContrato.jsx";
import Alocacao from "./components/alocacao.jsx";
import NovaALocacao from "./components/novaAlocacao.jsx";
import { PrivateRoute } from "./components/PrivateRoute.jsx";
import { EditarAlocacao } from "./components/editarAlocacao.jsx";
import { ListarManutencoes } from "./components/listarManutencoes.jsx";
import { NovaManutencao } from "./components/novaManutencao.jsx";
import { EditarManutencao } from "./components/editarManutencao.jsx";

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
          path="/contrato"
          element={
            <PrivateRoute>
              <ListarContratos />
            </PrivateRoute>
          }
        />

        <Route
          path="/contrato/nova"
          element={
            <PrivateRoute>
              <RegistroContrato />
            </PrivateRoute>
          }
        />

        <Route
          path="/contrato/editar/:id"
          element={
            <PrivateRoute>
              <EditarContrato />
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

        <Route
          path="/manutencao"
          element={
            <PrivateRoute>
              <ListarManutencoes />
            </PrivateRoute>
          }
        />

        <Route
          path="/manutencao/nova"
          element={
            <PrivateRoute>
              <NovaManutencao />
            </PrivateRoute>
          }
        />

        <Route
          path="/manutencao/editar/:id"
          element={
            <PrivateRoute>
              <EditarManutencao />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
