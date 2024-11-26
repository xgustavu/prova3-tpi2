import express from "express";
import routes from './routes';
import dotenv from "dotenv";
import connect from "./models/connection";
import { Soldado } from "./models";
import SoldadoModel from "./models/SoldadoModel";

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

// Incluir soldados

var soldados: Array<SoldadoModel> = [];
var soldado = new SoldadoModel(12, 173, "13213213213");
soldados.push(soldado);
soldado = new SoldadoModel(9, 180, "1321334534535");
soldados.push(soldado);

var x = 0;
soldados.forEach(soldado => {
    (async () => {
        soldado.id = await fetch('http://localhost:3001/soldado', {  // cria conexão HTTP com post para salvar o objeto no BD
            method: 'POST', // tipo de requisição
            headers: { // cabeçalho da requisição
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ // corpo da requisição convertido para JSON
                cim: soldado.cim,
                altura: soldado.altura,
                militar: soldado.militar,
            })
        })
            .then(response => response.json()) // resposta do backend
            .then(data => {
                //            console.log(data); // a rotina retorna o ID do objeto cadastrado
                soldados[x].id = data._id
                x++;
                return data._id;
            })
            .catch(error => {
                console.error(error); // mostra erro casso ocorra
            })
    })();
});