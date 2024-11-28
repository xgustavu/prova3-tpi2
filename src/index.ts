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
    const soldados = await Soldado.find().exec(); // Busca todos os soldados cadastrados

    if (soldados && soldados.length > 0) {
        console.log("<< Soldados Cadastrados >>");

        for (const soldado of soldados) {
            const militar = await Militar.findById(soldado.militar); // Busca o Militar relacionado ao Soldado

            if (militar) {
                console.log(
                    "Soldado:",
                    `${militar.nome} (CIM: ${soldado.cim})`,
                    `- Idade: ${militar.idade}`,
                    `- Altura: ${soldado.altura}m`,
                    `- Email: ${militar.email}`,
                    `- Fone: ${militar.fone}`
                );
            } else {
                console.log(`Soldado com CIM ${soldado.cim} não possui um militar associado.`);
            }
        }
    } else {
        console.log("Nenhum soldado cadastrado.");
    }
})();