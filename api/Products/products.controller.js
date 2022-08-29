const express = require("express");
const router = express.Router();

const productsHandler = require("./products.handler");

router.get("/", (req, res) => {
    productsHandler.buscarProdutos().then((resposta) => res.json(resposta));
})

router.get("/:id", (req, res) => {
    productsHandler.buscarPorID(req.params.id).then((resposta) => res.json(resposta));
})

router.post("/", (req, res) => {
    productsHandler.criarProduto(req.body).then((resposta) => res.json(resposta));
})

module.exports = router;