const crud = require("../../crud");

async function buscarPedidos() {
    const dados = await crud.get("Orders");
    for (const pedido of dados) {
        const pedidoProduto = await crud.getWithFilter("OrderProducts", "OrderId", "==", pedido.id);
        pedido.produtos = pedidoProduto;
    }
    return dados;
}

async function buscarPorID(id) {
    const dados = await crud.getById("Orders", id);
    return dados;
}

async function criarPedido(dado) {

    if (!dado.Number) {
        return { erro: "Digite o número (Number)!" }
    }
    if (!dado.UserId) {
        return { erro: "Digite o ID do Usuário (UserId)!" }
    }
    dado.status = "Em Aberto";

    try {
        const usuario = await crud.getById("Users", dado.UserId);
    } catch (error) {
        return { erro: "Usuário Inválido!" }
    }

    const pedidosAbertos = await crud.getWithFilter("Orders", "UserId", "==", dado.UserId);
    for (const pedido of pedidosAbertos) {
        if (pedido.status == "Em Aberto") {
            return { erro: "Usuário já possui pedido em aberto!" }
        }
    }

    const pedidoExistente = await crud.getWithFilter("Orders", "Number", "==", dado.Number);
    if (!pedidoExistente[0]) {
        const dados = await crud.save("Orders", undefined, dado);
        return dados;
    } else {
        return { erro: "Número Inválido!" }
    }
}

async function addProduto(dado) {

    if (!dado.ProductId) {
        return { erro: "Digite o ID do produto (ProductId)" }
    }
    if (!dado.OrderId) {
        return { erro: "Digite o ID do pedido (OrderId)" }
    }
    if(!dado.Quantity) {
        return { erro: "Digite a quantidade (Quantity)!"}
    }

    let pedido;
    try {
        pedido = await crud.getById("Orders", dado.OrderId);
    } catch (error) {
        return { erro: "Pedido Inválido!" }
    }

    try {
        const produto = await crud.getById("Products", dado.ProductId);
    } catch (error) {
        return { erro: "Produto Inválido!" }
    }

    if (pedido.status != "Em Aberto") {
        return { erro: "Pedido já foi finalizado!" }
    }

    const produtosPedido = await crud.getWithFilter("OrderProducts", "OrderId", "==", dado.OrderId);
    for (const produto of produtosPedido) {
        if (produto.ProductId == dado.ProductId) {
            produto.Quantity += dado.Quantity;
            const dados = await crud.save("OrderProducts", produto.id, produto);
            return dados;
        }
    }

    const dados = await crud.save("OrderProducts", undefined, dado);
    return dados;
}

async function baixarPedido(id) {
    const dado = await crud.getById("Orders", id);
    dado.status = "Finalizado";

    const dados = await crud.save("Orders", id, dado);
    return dados;
}

async function removerProduto(dado) {

    if (!dado.ProductId) {
        return { erro: "Digite o ID do produto (ProductId)" }
    }
    if (!dado.OrderId) {
        return { erro: "Digite o ID do pedido (OrderId)" }
    }
    if(!dado.Quantity) {
        return { erro: "Digite a quantidade (Quantity)!"}
    }

    let pedido;
    try {
        pedido = await crud.getById("Orders", dado.OrderId);
    } catch (error) {
        return { erro: "Pedido Inválido!" }
    }

    try {
        const produto = await crud.getById("Products", dado.ProductId);
    } catch (error) {
        return { erro: "Produto Inválido!" }
    }

    if (pedido.status != "Em Aberto") {
        return { erro: "Pedido já foi finalizado!" }
    }

    const pedidoProduto = await crud.getWithFilter("OrderProducts", "OrderId", "==", dado.OrderId);

    for (const produto of pedidoProduto) {
        if(produto.ProductId == dado.ProductId) {
            produto.Quantity -= dado.Quantity;
            if(produto.Quantity < 1) {
                const dados = await crud.remove("OrderProducts", produto.id);
                return dados;
            } else {
                const dados = await crud.save("OrderProducts", produto.id, produto);
                return dados;
            }
        }
    }
    
    return { erro: "O pedido não possui o produto indicado!"}
}

module.exports = {
    buscarPedidos,
    buscarPorID,
    criarPedido,
    addProduto,
    baixarPedido,
    removerProduto
}