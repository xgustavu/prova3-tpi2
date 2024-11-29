import express from "express";
import routes from './routes';
import dotenv from "dotenv";
import connect from "./models/connection";
import MilitarModel from "./models/MilitarModel";
import PatenteModel from "./models/PatenteModel";
import SoldadoModel from "./models/SoldadoModel";
import { Militar, Patente, Soldado } from "./models";

dotenv.config();

// será usado 3000 se a variável de ambiente não tiver sido definida
const PORT = process.env.PORT || 3000;
const app = express(); // cria o servidor e coloca na variável app

// suportar parâmetros JSON no body da requisição
app.use(express.json());

// conecta ao MongoDB no início da aplicação
connect();

// inicializa o servidor na porta especificada
app.listen(PORT, () => {
    console.log(`Rodando na porta ${PORT}`);
});

// define a rota para o pacote /routes
app.use(routes);

(async () => {
    try {
        const soldados = await Soldado.find().exec(); // Busca todos os soldados cadastrados

        if (soldados && soldados.length > 0) {
            for (const soldado of soldados) {
                const militar = await Militar.findById(soldado.militar); // Busca o Militar relacionado ao Soldado
                const alturaFormatada = soldado.altura.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });

                if (militar) {
                    console.log("<< Soldado >>");
                    console.log(`CIM: ${soldado.cim}`);
                    console.log(`Nome: ${militar.nome}`);
                    console.log(`Idade: ${militar.idade}`);
                    console.log(`Altura: ${alturaFormatada} m`);
                    console.log(`e-Mail: ${militar.email}`);
                    console.log(`Telefone: ${phoneMask(militar.fone)}`);
                    console.log("");
                } else {
                    console.log(`Soldado com CIM ${soldado.cim} não possui um militar associado.`);
                }
            }
        } else {
            console.log("Nenhum soldado cadastrado.");
        }
    } catch (error) {
        console.error("Erro ao listar soldados:", error);
    }
})();









function phoneMask(v: string | undefined): string {
    if (v == undefined) {
        return "";
    }

    let r = v.replace(/\D/g, "");
    r = r.replace(/^0/, ""); 

    if (r.length >= 11) {
        r = r.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (r.length > 7) {
        r = r.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (r.length > 2) {
        r = r.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    } else if (v.trim() !== "") {
        r = r.replace(/^(\d*)/, "($1");
    }

    return r;
}