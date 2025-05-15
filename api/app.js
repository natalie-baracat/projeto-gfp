import express from "express"
import { testarConexao } from "./db.js"
import cors from "cors"
import rotasUsuarios, { autenticarToken } from "./routes/rotasUsuarios.js"
import rotasCategorias from "./routes/rotasCategorias.js"
import rotasSubCateg from "./routes/rotasSub.js"
import rotasTransacoes from "./routes/rotasTransacoes.js"
import rotasContas from "./routes/rotasContas.js"

const app = express()
testarConexao()

app.use(cors())
app.use(express.json())


app.get("/", (req, res) => {
    res.send("API funcionando...")
})

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ROTAS USUARIOS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
app.post("/usuarios/login", rotasUsuarios.login)
app.post("/usuarios", rotasUsuarios.novoUsuario)
app.get("/usuarios", autenticarToken, rotasUsuarios.listarTodos)
app.patch("/usuarios/:id", autenticarToken, rotasUsuarios.atualizarUsuario)
app.put("/usuarios/:id", rotasUsuarios.atualizarTodosCampos) //nao deu
app.delete("/usuarios/:id", autenticarToken, rotasUsuarios.desativarUsuario)
app.get("/usuarios/:id", rotasUsuarios.consultaPorId)

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ROTAS CATEGORIAS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
app.post("/categorias", rotasCategorias.novaCategoria)
app.get("/categorias/filtrar-categoria", rotasCategorias.filtrarCategoria)
app.get("/categorias", autenticarToken, rotasCategorias.listarTodas)
app.patch("/categorias/:id_categoria", rotasCategorias.atualizarCategoria)
// app.put("/categorias/:id_categoria", rotasCategorias.atualizarTodosCampos)
app.get("/categorias/:id", rotasCategorias.consultaPorId)

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ROTAS SUBCATEGORIAS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
app.post("/subcategorias", rotasSubCateg.novaSubCateg)
app.get("/subcategorias", autenticarToken, rotasSubCateg.listarTodas)
app.patch("/subcategorias/:id_sub", rotasSubCateg.atualizarSubCateg)
app.delete("/subcategorias/:id_sub", rotasSubCateg.desativarSubCateg)
app.get("/subcategorias/:id", rotasSubCateg.consultaPorId)

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ROTAS CONTAS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
app.post("/contas", rotasContas.novaConta)
app.get("/contas/filtrar-nome", rotasContas.filtrarConta)
app.get("/contas", rotasContas.listarTodas)
app.patch("/contas/:id", rotasContas.atualizarConta)
app.delete("/contas/:id", rotasContas.desativarConta)
app.get("/contas/:id", rotasContas.consultaPorId)

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ROTAS TRANSAÇAO ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
app.post("/transacoes", rotasTransacoes.novaTransacao)
app.get("/transacoes", rotasTransacoes.listarTodas)
app.patch("/transacoes/:id_transacao", rotasTransacoes.atualizarTrans)
app.delete("/transacoes/:id", rotasTransacoes.desativarTrans)
app.get("/transacoes/:id", rotasTransacoes.consultaPorId)

const porta = 3000
app.listen(porta, () => {
    console.log(`Api rodando em https://localhost:${porta}`)
})