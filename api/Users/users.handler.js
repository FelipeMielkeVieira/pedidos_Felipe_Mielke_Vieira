const crud = require("../../crud");

async function buscarUsuarios() {
    const dados = await crud.get("Users");
    return dados;
}

async function buscarPorID(id) {
    try {
        const dados = await crud.getById("Users", id);
        return dados;
    } catch (erro) {
        return { erro: "ID Inválido!"}
    }
}

async function criarUsuario(dado) {

    if (!dado.CPF) {
        return { erro: "Digite o CPF!" }
    }
    if (!dado.Name) {
        return { erro: "Digite o nome (Name)!" }
    }
    if (!dado.Surname) {
        return { erro: "Digite o sobrenome (Surname)!" }
    }

    const usuarioExistente = await crud.getWithFilter("Users", "CPF", "==", dado.CPF);
    if (!usuarioExistente[0]) {
        const dados = await crud.save("Users", undefined, dado);
        return dados;
    } else {
        return { erro: "CPF Inválido!" }
    }
}

module.exports = {
    buscarUsuarios,
    buscarPorID,
    criarUsuario
}