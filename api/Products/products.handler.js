const crud = require("../../crud");

async function buscarProdutos() {
    const dados = await crud.get("Products");
    return dados;
}

async function buscarPorID(id) {
    const dados = await crud.getById("Products", id);
    return dados;
}

async function criarProduto(dado) {

    if (!dado.Name) {
        return { erro: "Digite o nome (Name)!" }
    }
    if (!dado.Price) {
        return { erro: "Digite o preço (Price)!" }
    }

    const produtoExistente = await crud.getWithFilter("Products", "Name", "==", dado.Name);
    if (!produtoExistente[0]) {
        const dados = await crud.save("Products", undefined, dado);
        return dados;
    } else {
        return { erro: "Nome Inválido!" }
    }
}

module.exports = {
    buscarProdutos,
    buscarPorID,
    criarProduto
}