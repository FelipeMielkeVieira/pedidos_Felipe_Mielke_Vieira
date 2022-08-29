const express = require("express");
const router = express.Router();

const ordersHandler = require("./orders.handler");

router.get("/", (req, res) => {
    ordersHandler.buscarPedidos().then((resposta) => res.json(resposta));
})

router.get("/:id", (req, res) => {
    ordersHandler.buscarPorID(req.params.id).then((resposta) => res.json(resposta));
})

router.post("/", (req, res) => {
    ordersHandler.criarPedido(req.body).then((resposta) => res.json(resposta));    
})

router.post("/produto", (req, res) => {
    ordersHandler.addProduto(req.body).then((resposta) => res.json(resposta));    
})

router.put("/:id", (req, res) => {
    ordersHandler.baixarPedido(req.params.id).then((resposta) => res.json(resposta));
})

router.delete("/", (req, res) => {
    ordersHandler.removerProduto(req.body).then((resposta) => res.json(resposta));
})

module.exports = router;