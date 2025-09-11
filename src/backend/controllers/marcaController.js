import { db } from "../database/database.js";
import { Sequelize } from "sequelize";
import modelMarca from "../models/modelMarca.js";

async function criarMarca(req,res) {
    try {
        const marca = {
            nome: req.body.nome
        }

        if(!modelMarca.sync().isPending){
            await modelMarca.sync()
        }

        const result = await modelMarca.create(marca)

        if(result){
            res.status(201).send({msg: "Marca Criada com Sucesso!"})
        }else{
            res.status(400).send({msg: "Erro ao criar Marca."})
        }
        
    } catch (error) {
        console.error(error)
    }
    
}

async function editarMarca(req, res) {
    try {

        let marca = modelMarca.findByPk(req.params.id)

         if (marca) {
                marca.then(
                (dado) => {
                (dado.nome = req.body.nome)   

                if (dado.save() != null) {
                    res.status(200).send({
                    msg: `Marca atualizada com sucesso. Marca: ${dado.id} - ${dado.nome}`,
                });
                }
        },
        (error) => {
          console.error("Erro ao atualizar Marca", error);
        }
      );
    }
        
    } catch (error) {
        console.error(error)
    }
}

async function listarMarcas(req, res) {
    try {

        const result = modelMarca.findAll()

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

async function excluirMarca(req,res) {
    try {
    
        const marca = modelMarca.findByPk(req.params.id)
       
        if (marca) {
        marca.then(
            (dado) => {
            if (dado.destroy()) {
                res
                .status(200)
                .send({ msg: `Marca ${dado.nome} deletada com sucesso!` });
            }
            },
            (error) => {
            onsole.error("Erro ao deletar Marca", error);
            }
        );
        }
    } catch (error) {
        console.error(error)
    }
}

export default {criarMarca, editarMarca, listarMarcas, excluirMarca}