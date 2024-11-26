import { Router, Request, Response } from "express";
import militar from './Militar';
import patente from './Patente';
import soldado from './Soldado';

const routes = Router();
routes.use("/militar", militar);
routes.use("/patente", patente);
routes.use("/soldado", soldado);

//aceita qualquer método HTTP ou URL
routes.use( (_:Request,res:Response) => res.json({error:"Requisição desconhecida"}) );

export default routes;