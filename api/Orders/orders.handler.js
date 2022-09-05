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
    try {
        const dados = await crud.getById("Orders", id);
        return dados;
    } catch (erro) {
        return { erro: "ID Inválido!"}
    }
}

async function criarPedido(dado) {

    if (!dado.UserId) {
        return { erro: "Digite o ID do Usuário (UserId)!" }
    }
    dado.status = "Em Aberto";

    const pedidos = await crud.getWithFilter("Orders", "UserId", "==", dado.UserId);
    dado.Number = pedidos.length + 1;

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

    const dados = await crud.save("Orders", undefined, dado);
    return dados;
}

async function addProduto(dado) {

    if (!dado.ProductId && !dado.Products) {
        return { erro: "Digite o ID do produto (ProductId) ou lista de produtos (Products)" }
    }
    if (!dado.OrderId) {
        return { erro: "Digite o ID do pedido (OrderId)" }
    }
    if (!dado.Quantity) {
        dado.Quantity = 1;
    }

    let pedido;
    try {
        pedido = await crud.getById("Orders", dado.OrderId);
    } catch (error) {
        return { erro: "Pedido Inválido!" }
    }

    if (pedido.status != "Em Aberto") {
        return { erro: "Pedido já foi finalizado!" }
    }

    if(dado.ProductId) {
        if(dado.Products) {
            dado.Products.push({ProductId: dado.ProductId, Quantity: dado.Quantity});
        } else {
            dado.Products = [{ProductId: dado.ProductId, Quantity: dado.Quantity}];
        }
    }

    try {
        for (const produto of dado.Products) {
            const produtoPedido = await crud.getById("Products", produto.ProductId);   
        }
    } catch (error) {
        return { erro: "Produto Inválido!" }
    }

    const produtosPedido = await crud.getWithFilter("OrderProducts", "OrderId", "==", dado.OrderId);
    for (const produto of dado.Products) {
        for (const produtoPedido of produtosPedido) {
            if (produtoPedido.ProductId == produto.ProductId) {

                if(!produto.Quantity) {
                    produto.Quantity = dado.Quantity;
                }
                produtoPedido.Quantity += produto.Quantity;

                const dados = await crud.save("OrderProducts", produtoPedido.id, produtoPedido);
                return dados;
            }
        }   
    }

    for (const produto of dado.Products) {
        produto.OrderId = dado.OrderId;
        const dados = await crud.save("OrderProducts", undefined, produto);
    }

    const dados = await crud.getWithFilter("OrderProducts", "OrderId", "==", dado.OrderId);;
    return dados;
}

async function baixarPedido(id) {
    try {
        const dado = await crud.getById("Orders", id);
        dado.status = "Finalizado";

        const dados = await crud.save("Orders", id, dado);
        return dados;
    } catch (erro) {
        return { erro: "Pedido Inválido!"}
    }
}

async function removerProduto(dado) {

    if (!dado.ProductId && !dado.Products) {
        return { erro: "Digite o ID do produto (ProductId)" }
    }
    if (!dado.OrderId) {
        return { erro: "Digite o ID do pedido (OrderId)" }
    }
    if (!dado.Quantity) {
        dado.Quantity = 1;
    }

    let pedido;
    try {
        pedido = await crud.getById("Orders", dado.OrderId);
    } catch (error) {
        return { erro: "Pedido Inválido!" }
    }

    if (pedido.status != "Em Aberto") {
        return { erro: "Pedido já foi finalizado!" }
    }

    if(dado.ProductId) {
        if(dado.Products) {
            dado.Products.push({ProductId: dado.ProductId, Quantity: dado.Quantity});
        } else {
            dado.Products = [{ProductId: dado.ProductId, Quantity: dado.Quantity}];
        }
    }

    for (const produto of dado.Products) {
        try {
            const produtoPedido = await crud.getById("Products", produto.ProductId);
        } catch (error) {
            return { erro: "Produto Inválido!" }
        }   
    }

    const pedidoProduto = await crud.getWithFilter("OrderProducts", "OrderId", "==", dado.OrderId);

    for (const produto of dado.Products) {
        for (const produtoPedido of pedidoProduto) {
            if (produtoPedido.ProductId == produto.ProductId) {

                if(!produto.Quantity) {
                    produto.Quantity = dado.Quantity;
                }
                produtoPedido.Quantity -= produto.Quantity;

                if (produtoPedido.Quantity < 1) {
                    const dados = await crud.remove("OrderProducts", produtoPedido.id);
                } else {
                    produtoPedido.OrderId = dado.OrderId;
                    const dados = await crud.save("OrderProducts", produtoPedido.id, produtoPedido);
                }
            }
        }   
    }

    const dados = await crud.getWithFilter("OrderProducts", "OrderId", "==", dado.OrderId);
    return dados;
}

module.exports = {
    buscarPedidos,
    buscarPorID,
    criarPedido,
    addProduto,
    baixarPedido,
    removerProduto
}