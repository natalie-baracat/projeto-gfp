import express from "express"
import { testarConexao } from "./db.js"
import cors from "cors"
import rotasUsuarios, { autenticarToken } from "./routes/rotasUsuarios.js"
import rotasCategorias from "./routes/rotasCategorias.js"
import rotasSubCateg from "./routes/rotasSub.js"
import rotasLocalTransacao from "./routes/rotasLocalTransacao.js"
import rotasTransacoes from "./routes/rotasTransacoes.js"

const app = express()
testarConexao()

app.use(cors())
app.use(express.json())


app.get("/", (req, res) => {
    res.send("API funcionando...")
})

// ROTAS USUARIOS
app.post("/usuarios/login", rotasUsuarios.login)
app.post("/usuarios", rotasUsuarios.novoUsuario)
app.get("/usuarios", autenticarToken, rotasUsuarios.listarTodos)
app.patch("/usuarios/:id", autenticarToken, rotasUsuarios.atualizarUsuario)
app.put("/usuarios/:id", rotasUsuarios.atualizarTodosCampos) //nao deu
app.delete("/usuarios/:id", autenticarToken, rotasUsuarios.desativarUsuario)
app.get("/usuarios/:id", rotasUsuarios.consultaPorId)

// ROTAS CATEGORIAS
app.post("/categorias", rotasCategorias.novaCategoria)
app.get("/categorias", autenticarToken, rotasCategorias.listarTodas)
app.patch("/categorias/:id_categoria", rotasCategorias.atualizarCategoria)
// app.put("/categorias/:id_categoria", rotasCategorias.atualizarTodosCampos)
app.delete("/categorias/:id_categoria", rotasCategorias.desativarCategoria)
app.get("/categorias/:id", rotasCategorias.consultaPorId)

// ROTAS SUBCATEGORIAS
app.post("/subcategorias", rotasSubCateg.novaSubCateg)
app.get("/subcategorias", autenticarToken, rotasSubCateg.listarTodas)
app.patch("/subcategorias/:id_sub", rotasSubCateg.atualizarSubCateg)
app.delete("/subcategorias/:id_sub", rotasSubCateg.desativarSubCateg)
app.get("/subcategorias/:id", rotasSubCateg.consultaPorId)

// ROTAS LOCAL TRANSAÇAO
app.post("/local-transacao", rotasLocalTransacao.novoLocalTrans)
app.get("/local-transacao", rotasLocalTransacao.listarTodas)
app.patch("/local-transacao/:id", rotasLocalTransacao.atualizarLocalTrans)
app.delete("/local-transacao/:id", rotasLocalTransacao.desativarLocalTrans)
app.get("/local-transacao/:id", rotasLocalTransacao.consultaPorId)

// ROTAS TRANSAÇAO
app.post("/transacoes", rotasTransacoes.novaTransacao)
app.get("/transacoes", rotasTransacoes.listarTodas)
app.patch("/transacoes/:id_transacao", rotasTransacoes.atualizarTrans)
app.delete("/transacoes/:id", rotasTransacoes.desativarTrans)
app.get("/transacoes/:id", rotasT.consultaPorId)

const porta = 3000
app.listen(porta, () => {
    console.log(`Api rodando em https://localhost:${porta}`)
})