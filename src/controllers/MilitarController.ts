import { Request, Response } from "express";
import { Militar } from "../models";

class MilitarController {
  
  public async create(req: Request, res: Response): Promise<Response> {
    const { nome, idade, email, fone } = req.body;
    try {
      const document = new Militar({ nome, idade, email, fone });
      const resp = await document.save();
      return res.json(resp);
    } catch (error: any) {
        if (error.code === 11000 || error.code === 11001) {
            // código 11000 e 11001 indica violação de restrição única (índice duplicado)
            return res.json({ message: "Este e-mail já está em uso!" });
        } else if (error && error.errors["email"]) {
            return res.json({ message: error.errors["email"].message });
        } else if (error && error.errors["nome"]) {
            return res.json({ message: error.errors["nome"].message });
        } else if (error && error.errors["idade"]) {
            return res.json({ message: error.errors["idade"].message });
        }else if (error && error.errors["fone"]) {
            return res.json({ message: error.errors["fone"].message });
        }
        return res.json({ message: error.message });
    }
  }

  // list

  public async list(_: Request, res: Response): Promise<Response> {
    try {
      const objects = await Militar.find().sort({ nome: 1 });
      return res.json(objects);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // delete

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id: _id } = req.body; // _id do registro a ser excluído
    try {
      const object = await Militar.findByIdAndDelete(_id);
      if (object) {
        return res.json({ message: "Registro excluído com sucesso!" });
      } else {
        return res.json({ message: "Registro inexistente!" });
      }
    } catch (error: any) {
      return res.json({ message: error.message });
    }
  }

  // update

  public async update(req: Request, res: Response): Promise<Response> {
    const { id, nome, idade, email, fone  } = req.body;
    try {
      // busca a editora existente na coleção antes de fazer o update
      const document = await Militar.findById(id);
      if (!document) {
        return res.json({ message: "Disciplina inexistente!" });
      }
      // atualiza os campos
      document.nome = nome;
      document.idade = idade;
      document.email = email;
      document.fone = fone;
      // ao salvar serão aplicadas as validações do esquema
      const resp = await document.save();
      return res.json(resp);
    } catch (error: any) {
        if (error.code === 11000 || error.code === 11001) {
            // código 11000 e 11001 indica violação de restrição única (índice duplicado)
            return res.json({ message: "Este e-mail já está em uso!" });
        } else if (error && error.errors["email"]) {
            return res.json({ message: error.errors["email"].message });
        } else if (error && error.errors["nome"]) {
            return res.json({ message: error.errors["nome"].message });
        } else if (error && error.errors["idade"]) {
            return res.json({ message: error.errors["idade"].message });
        }else if (error && error.errors["fone"]) {
            return res.json({ message: error.errors["fone"].message });
        }
        return res.json({ message: error.message });
    }
  }
}

export default new MilitarController();