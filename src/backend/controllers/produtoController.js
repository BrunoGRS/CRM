import { db } from "../database/database.js";
import modelProduto from "../models/modelProduto.js";
import { Sequelize } from "sequelize";

async function criarProduto(req,res) {
    try { 
        
        const produto = {
          nome: req.body.nome,
          preco: req.body.preco,
          estoque: req.body.estoque,
          categoria_id: req.body.categoria_id || null,
          marca_id: req.body.marca_id || null,
        };
    
        if (!modelProduto.sync().isPendig) {
          await modelProduto.sync();
        }
    
        const result = await modelProduto.create(produto);
    
        if (result) {
          res.status(201).send({ msg: "Produto cadastrado com sucesso!" });
        }
        
    } catch (error) {
        console.error(error)
    } 
    
}

export default {criarProduto}