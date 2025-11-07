# 🧾 Sistema de Gestão ABEXV

Este projeto é um sistema completo de **gestão comercial e operacional**, desenvolvido com **Node.js (Express)** no back-end e **React (Vite)** no front-end.  
O sistema permite o controle de **vendas, alocação de máquinas de café, manutenções, upload de arquivos, clientes, oportunidades e categorias de produtos**.

---

## 🚀 Tecnologias Utilizadas

### 🖥️ Back-end
- Node.js  
- Express  
- Sequelize ORM  
- MySQL  
- Multer (upload de arquivos via BLOB)  

### 💻 Front-end
- React (Vite)  
- React Router DOM  
- Axios  
- React Toastify  

---

## 🧱 Estrutura do Projeto

```
📦 abexv
 ┣ 📂 src
 ┃ ┣ 📂 backend
 ┃ ┃ ┣ 📂 controllers      → Lógica de negócio (CRUDs)
 ┃ ┃ ┣ 📂 models           → Definições Sequelize (tabelas)
 ┃ ┃ ┣ 📂 routes           → Rotas Express (por módulo)
 ┃ ┃ ┗ 📜 server.js        → Inicialização da API
 ┃ ┣ 📂 frontend           → Projeto React (interface)
 ┃ ┗ 📜 database.js        → Configuração do Sequelize
 ┗ 📜 README.md
```

---

## ⚙️ Funcionalidades

### 📦 **Módulo de Vendas**
- Registrar novas vendas (cliente, vendedor, valor total, observações)
- Editar, listar e excluir vendas
- Endpoint: `/api/vendas`

### 🏭 **Módulo de Alocação**
- Gerencia alocação de **máquinas de café**
- Controla empresa, data de instalação e status
- Endpoint: `/api/alocacoes`

### 🧰 **Módulo de Manutenção**
- Controla **manutenções preventivas e corretivas**
- Armazena data, técnico responsável, descrição e custo
- Endpoint: `/api/manutencoes`

### 📂 **Módulo de Arquivos**
- Upload de **PDFs, imagens e relatórios** diretamente no banco de dados (BLOB)
- Visualização e exclusão de arquivos
- Endpoint: `/api/arquivos`

### 🧩 **Módulo de Categorias e Produtos**
- Cadastro e listagem de categorias de produtos
- Ligação com o módulo de oportunidades e vendas
- Endpoint: `/api/categorias`

---

## 🔗 Rotas Principais

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/vendas/criar` | Cadastra uma nova venda |
| `GET` | `/api/vendas/listar` | Lista todas as vendas |
| `PUT` | `/api/vendas/editar/:id` | Atualiza uma venda existente |
| `DELETE` | `/api/vendas/:id` | Exclui uma venda |
| `POST` | `/api/arquivos/upload` | Faz upload de arquivo (PDF/imagem) |
| `GET` | `/api/arquivos/:id` | Visualiza o arquivo armazenado |
| `POST` | `/api/alocacoes/criar` | Cadastra uma nova alocação de máquina |
| `POST` | `/api/manutencoes/criar` | Registra uma manutenção |

---

## 🧑‍💻 Como Executar o Projeto

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/brunorodrigues/abexv.git
cd abexv
```

### 2️⃣ Instalar dependências
```bash
npm install
```

### 3️⃣ Configurar o banco de dados
Edite o arquivo `src/backend/database/database.js` com suas credenciais:
```js
export const db = new Sequelize('NOME_BANCO', 'USUARIO', 'SENHA', {
  host: 'localhost',
  dialect: 'mysql'
});
```

### 4️⃣ Rodar o servidor
```bash
npm run dev
```

A API será executada em:
```
http://localhost:3000
```

### 5️⃣ Rodar o front-end (caso tenha React configurado)
```bash
cd src/frontend
npm run dev
```

---

## 🧠 Exemplos de Teste via Postman

### Criar Venda
```
POST http://localhost:3000/api/vendas/criar
Content-Type: application/json

{
  "cliente_id": 1,
  "vendedor_id": 2,
  "valor_total": 1500.00,
  "observacao": "Venda à vista"
}
```

### Upload de Arquivo
```
POST http://localhost:3000/api/arquivos/upload
(form-data)
arquivo: [selecionar arquivo]
```

---

## 🧾 Licença
Este projeto é de uso interno da **ABEXV**.  
Distribuição, cópia ou uso comercial sem autorização não é permitido.

---

## ✨ Desenvolvido por
**Bruno Rodrigues**  
👨‍💻 Bacharel em Ciência da Computação  
📍 Brasil  
