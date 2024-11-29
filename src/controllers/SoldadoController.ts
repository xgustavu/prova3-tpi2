import { Request, Response } from "express";
import { Soldado } from "../models";
import { Militar } from "../models";

class SoldadoController{

    public async create(req: Request, res: Response) {
        const { cim, altura, militar: nomeMilitar } = req.body;
    
        try {
 
            const militar = await Militar.findOne({ nome: nomeMilitar });
            if (!militar) {
                return res.status(404).json({ message: `Militar com o nome "${nomeMilitar}" não encontrado.` });
            }
    
            const document = new Soldado({
                cim,
                altura,
                militar: militar._id, 
            });
    
            const resp = await document.save();
            return res.status(201).json(resp); 
    
        } catch (error: any) {
            // Tratamento de erros
            if (error.code === 11000 || error.code === 11001) {
                // Código de erro para violação de índice único (duplicado)
                return res.status(400).json({ message: "Este CIM já está em uso!" });
            } else if (error.errors) {
                // Validação de campos no mongoose
                if (error.errors["cim"]) {
                    return res.status(400).json({ message: error.errors["cim"].message });
                } else if (error.errors["altura"]) {
                    return res.status(400).json({ message: error.errors["altura"].message });
                } else if (error.errors["militar"]) {
                    return res.status(400).json({ message: error.errors["militar"].message });
                }
            }
    
            // Erro genérico
            return res.status(500).json({ message: "Erro ao criar o soldado.", error: error.message });
        }
    }

    public async list(_: Request, res: Response): Promise<Response> {
        try {
            const objects = await Soldado.aggregate([
                {
                  $lookup: {
                    from: "militar", 
                    localField: "militar",
                    foreignField: "_id", 
                    as: "militarInfo",
                  },
                },
                {
                  $unwind: "$militarInfo",
                },
              ]);

              return res.json(objects);
        } catch (error: any) {
            return res.json({ message: error.message });
        }
    };

    public async delete(req: Request, res: Response): Promise<Response> {
        const { id: _id } = req.body; // _id do registro a ser excluído
        try {
            const object = await Soldado.findByIdAndDelete(_id);
            if (object) {
                return res.json({ message: "Registro excluído com sucesso!" });
            } else {
                return res.json({ message: "Registro inexistente!" });
            }
        } catch (error: any) {
            return res.json({ message: error.message });
        }
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const { id, cim, altura, militar } = req.body;
        try {
            // busca o militar existente na coleção antes de fazer o update
            const document = await Soldado.findById(id);
            if (!document) {
                return res.json({ message: "Militar inexistente!" });
            }
            // atualiza os campos
            document.cim = cim;
            document.altura = altura;
            document.militar = militar;
            // ao salvar serão aplicadas as validações do esquema
            const resp = await document.save();
            return res.json(resp);
        } catch (error: any) {
            if (error.code === 11000 || error.code === 11001) {
                // código 11000 e 11001 indica violação de restrição única (índice duplicado)
                return res.json({ message: "Este cim já está em uso!" });
            } else if (error && error.errors["cim"]) {
                return res.json({ message: error.errors["cim"].message });
            } else if (error && error.errors["altura"]) {
                return res.json({ message: error.errors["altura"].message });
            } else if (error && error.errors["militar"]) {
                return res.json({ message: error.errors["militar"].message });
            }
            return res.json({ message: error.message });
        }
    }

};

export default new SoldadoController;