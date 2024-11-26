import express from "express";
import routes from './routes';
import dotenv from "dotenv";
import connect from "./models/connection";
import PatenteModel from "./models/PatenteModel";

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

// Incluir Editoras

var patentes: Array<PatenteModel> = [];
var patente = new PatenteModel(10, "Aspirante");
patentes.push(patente);
patente = new PatenteModel(15, "Paraquedista");
patentes.push(patente);

var y = 0;

patentes.forEach(patente => {
    (async () => {
        patente.id = await fetch('http://localhost:3001/patente', {  // cria conexão HTTP com post para salvar o objeto no BD
            method: 'POST', // tipo de requisição
            headers: { // cabeçalho da requisição
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ // corpo da requisição convertido para JSON
                codigo: patente.codigo,
                cnpj: patente.descricao,
            })
        })
            .then(response => response.json()) // resposta do backend
            .then(data => {
                // console.log(data); // a rotina retorna o ID do objeto cadastrado
                patentes[y].id = data._id
                y++;
                return data._id;
            })
            .catch(error => {
                console.error(error); // mostra erro casso ocorra
            })
    })();
});
