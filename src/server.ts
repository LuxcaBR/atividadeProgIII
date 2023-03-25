import express from "express";
import { randomUUID } from "node:crypto";
import { Database } from "./database";
import { router } from "./router/index";

const server = express();

const port = 3333; //porta

server.use(express.json());

server.use(router);


//CallBack
server.listen(port, () => {
  console.log(`Server Online! - end: http://localhost:${port}`);
});
