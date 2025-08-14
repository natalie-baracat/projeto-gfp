import express from "express"
import { testarConexao } from "./db.js"
import cors from "cors"
import rotasUsuarios, { autenticarToken } from "./routes/rotasUsuarios.js"

import rotasCategorias from "./routes/rotasCategorias.js"
import rotasSubCateg from "./routes/rotasSub.js"
import rotasTransacoes from "./routes/rotasTransacoes.js"
import rotasContas from "./routes/rotasContas.js"

import swaggerUi from "swagger-ui-express"
import swaggerSpec from "./swagger.js"

const app = express()
testarConexao()

app.use(cors())
app.use(express.json())

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get("/", (req, res) => {
    res.redirect('/api-docs')
})

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ROTAS USUARIOS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
app.post("/usuarios/login", rotasUsuarios.login)
app.post("/usuarios/new", rotasUsuarios.novoUsuario)
app.get("/usuarios", autenticarToken, rotasUsuarios.listarTodos)
app.patch("/usuarios/editar/:id", autenticarToken, rotasUsuarios.atualizarUsuario)
app.put("/usuarios/:id", rotasUsuarios.atualizarTodosCampos) //nao deu
app.delete("/usuarios/:id", autenticarToken, rotasUsuarios.desativarUsuario)
app.get("/usuarios/:id", rotasUsuarios.consultaPorId)

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ROTAS CATEGORIAS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
app.post("/categorias/new", rotasCategorias.novaCategoria)
app.get("/categorias/filtrar-categoria", rotasCategorias.filtrarCategoria)
app.get("/categorias", rotasCategorias.listarTodas)
app.patch("/categorias/editar/:id_categoria", rotasCategorias.atualizarCategoria)
// app.put("/categorias/:id_categoria", rotasCategorias.atualizarTodosCampos)
app.get("/categorias/:id", rotasCategorias.consultaPorId)
app.delete("/categorias/:id_categoria", rotasCategorias.desativarCategoria)

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ROTAS SUBCATEGORIAS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
app.post("/subcategorias", rotasSubCateg.novaSubCateg)
app.get("/subcategorias", rotasSubCateg.listarTodas)
app.patch("/subcategorias/editar/:id_sub", rotasSubCateg.atualizarSubCateg)
app.delete("/subcategorias/:id_sub", rotasSubCateg.desativarSubCateg)
app.get("/subcategorias/:id", rotasSubCateg.consultaPorId)

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ROTAS CONTAS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
app.get("/contas", autenticarToken, rotasContas.listarTodas)
app.post("/contas/new", rotasContas.novaConta)
app.get("/contas/filtrar-nome", rotasContas.filtrarConta)
app.patch("/contas/editar/:id", rotasContas.atualizarConta)
app.delete("/contas/:id", autenticarToken, rotasContas.desativarConta)
app.get("/contas/:id", rotasContas.consultaPorId)

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ROTAS TRANSAÇOES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
app.post("/transacoes/new", rotasTransacoes.novaTransacao)
app.get("/transacoes/filtrar-data", rotasTransacoes.filtrarPorData)
app.get("/transacoes/somar-transacoes", rotasTransacoes.somarTrans)
app.get("/transacoes/transacoes-vencidas/:id_usuario", rotasTransacoes.transacoesVencidas)
app.get("/transacoes", rotasTransacoes.listarTodas)
// app.patch("/transacoes/editar/:id_transacao", rotasTransacoes.atualizarTrans)
// app.delete("/transacoes/:id", rotasTransacoes.desativarTrans)
// app.get("/transacoes/:id", rotasTransacoes.consultaPorId)

const porta = 3000
app.listen(porta, () => {
    console.log(`Api rodando em http://localhost:${porta}`)
})