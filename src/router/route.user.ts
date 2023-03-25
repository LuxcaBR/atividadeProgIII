import { Router } from "express";
import { randomUUID } from "node:crypto";
import { Database } from "../database";

const userRoute = Router();

const database = new Database();

const table = "user";

//Request - parâmetro que vem de Cliente
//Response - parâmetro que vem de Cliente
userRoute.get("/", (request, response) => {
  const user = database.select(table);
  response.json(user);
});

//Adicionar Usuário
userRoute.get("/", (request, response) => {
  const { name, saldo, transicao } = request.body;

  const user = {
    id:randomUUID(),
    name,
    saldo,
    transicao
  };

  // console.log(result, " - ", typeof result);

    database.insert(table, user);
    response.status(201).send({msg:'OK!'})
});

// Parâmetro que esta vindo do CLIENTE - REQUEST
// Parâmetro que esta indo para o CLIENTE - RESPONSE

//Deletar por ID
userRoute.delete('/:id', (request, response) => {
  const {id} = request.params

  const userExist:any = database.select(table, id);

  if(userExist === undefined)
  return response.status(400).json(
    {msg:'Usuário não encontrado!'});

    database.delete(table, id)

    response.status(202).json(
      {msg: `Usuário ${userExist.name} deletado!` });

  //database.select(table, id)
});

//metodo de editar o user
userRoute.put('/:id', (request,response)=>{

  const {id} = request.params
  const {name, saldo, transicao} = request.body

  const userExist:any = database.select(table, id);

  if(userExist === undefined)
  return response.status(400).json(
    {msg:'Usuário não encontrado!'});

    database.update(table, id, {id, name, saldo, transicao})

    response.status(201).json(
      {msg: `Usuário ${userExist.name} foi atualizado!` });

})

//metodo de retirada pelo ID
userRoute.put('/retirada/:id', (request,response)=>{

  const {id} = request.params
  const {name, saldo, transicao: [{ tipo, valor}]} = request.body

  const userExist:any = database.select(table, id);

  if(userExist === undefined)
  return response.status(400).json(
    {msg:'Usuário não encontrado!'});

    database.update(table, id, {id, name, saldo: saldo - valor, transicao: [{ tipo, valor}]})

    response.status(201).json(
      {msg: ` Foi retirado  ${userExist.valor} Reais!` });

})

//metodo de deposito pelo ID
userRoute.put('/deposito/:id', (request,response)=>{

  const {id} = request.params
  const {name, saldo, transicao: [{ tipo, valor}]} = request.body

  const userExist:any = database.select(table, id);

  if(userExist === undefined)
  return response.status(400).json(
    {msg:'Usuário não encontrado'});

    database.update(table, id, {id, name, saldo: saldo + valor, transicao: [{ tipo, valor}]})

    response.status(201).json(
      {msg: ` Foi depositado o valor de  ${userExist.valor}` });

})
export {userRoute}
