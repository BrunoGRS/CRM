import { db } from "../database/database.js";
import { Sequelize } from "sequelize";
import modelCategoria from "../models/modelCategoria.js";

async function criarCategoria(req,res) {
    try {
        const categoria = {
            nome: req.body.nome
        }

        if(!modelCategoria.sync().isPending){
            await modelCategoria.sync()
        }

        const result = await modelCategoria.create(categoria)

        if(result){
            res.status(201).send({msg: "Categoria Criada com Sucesso!"})
        }else{
            res.status(400).send({msg: "Erro ao criar categoria."})
        }
        
    } catch (error) {
        console.error(error)
    }
    
}

async function editarCaregoria(req, res) {
    try {

        let categoria = modelCategoria.findByPk(req.params.id)

         if (categoria) {
                categoria.then(
                (dado) => {
                (dado.nome = req.body.nome)   

                if (dado.save() != null) {
                    res.status(200).send({
                    msg: `Categoria atualizada com sucesso. Categoria: ${dado.id} - ${dado.nome}`,
                });
                }
        },
        (error) => {
          console.error("Erro ao atualizar categoria", error);
        }
      );
    }
        
    } catch (error) {
        console.error(error)
    }
}

async function listarCategorias(req, res) {
    try {

        const result = modelCategoria.findAll()

       if (result) {
            result.then(
            (dados) => {
            res.status(200).send({ msg: dados });
            },
            (error) => {
             res.status(500).send({ msg: error });
            }
        );
        }
    } catch (error) {
        console.error(error)
    }
    
}

async function excluirCategoria(req,res) {
    try {
    
        const categoria = modelCategoria.findByPk(req.params.id)
       
        if (categoria) {
        categoria.then(
            (dado) => {
            if (dado.destroy()) {
                res
                .status(200)
                .send({ msg: `Categoria ${dado.nome} deletada com sucesso!` });
            }
            },
            (error) => {
            onsole.error("Erro ao deletar Categoria", error);
            }
        );
        }
    } catch (error) {
        console.error(error)
    }
    
}

export default {criarCategoria, editarCaregoria, listarCategorias, excluirCategoria}