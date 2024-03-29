import { Router } from "express";
import { randomUUID } from "node:crypto";
import { Database } from "../database";

const userRoute = Router();

const database = new Database();

const table = "user";

//Request - parâmetro que vem de Cliente
//Response - parâmetro que vem de Cliente
userRoute.get('/', (request, response) => {
  const user = database.select(table);
  response.json(user);
});

userRoute.get('/:id', (request, response) => {
  const {id} = request.params

 const result = database.select(table, id);

 if(result === undefined) response.status(400).json({msg:'Usuário não encontrado'})

  response.json(result)
})

//Adicionar Usuário
userRoute.post('/', (request, response) => {
  const { nome, email } = request.body;

  const user = {
    id:randomUUID(),
    nome,
    email,
    saldo: 0,
    transferencia: []
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
      {msg: `Usuário deletado!` });

  //database.select(table, id)
});

//Alterar o Usuário.
userRoute.put('/:id', (request,response)=>{

  const {id} = request.params
  const {nome,  email} = request.body

  const userExist:any = database.select(table, id);

  if(userExist === undefined)
  return response.status(400).json(
    {msg:'Usuário não encontrado!'});


    const { saldo, transferencia } = userExist
    database.update(table, id, {nome, email, saldo, transferencia})

    response.status(201).json(
      {msg: `Usuário ${userExist.nome} foi atualizado!` });

})

//Saque por ID.
userRoute.put('/retirada/:id', (request,response)=>{

  const {id} = request.params
  const {nome, tipo, valor } = request.body

  const userExist:any = database.select(table, id);

  if(userExist === undefined)
  return response.status(400).json(
    {msg:'Usuário não encontrado!'});

  if(userExist.saldo < valor)
  return response.status(400).json(
    {msg:'Saldo insuficiente!'});

        let transferencia = userExist.transferencia
        transferencia.push({tipo, valor})
 
        database.update(table, id, {
          id, 
          nome, 
          saldo: userExist.saldo - Number(valor), 
          transferencia
        })

        response.status(201).json(
          {msg: ` Foi sacado o valor de  ${valor}` });
})



//Deposito pelo ID
userRoute.put('/deposito/:id', (request,response)=>{

  const {id} = request.params
  const { nome, tipo, valor } = request.body

  const userExist:any = database.select(table, id);

  if(userExist === undefined)
  return response.status(400).json(
    {msg:'Usuário não encontrado'});

    let transferencia = userExist.transferencia
    transferencia.push({tipo, valor})

    database.update(table, id, {
      id, 
      nome, 
      saldo: userExist.saldo + valor, 
      transferencia
    })

    response.status(201).json(
      {msg: ` Foi depositado o valor de  ${valor}` });

})

export {userRoute}
