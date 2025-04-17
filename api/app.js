import express from "express"
import { testarConexao } from "./db.js"
import cors from "cors"
import rotasUsuarios from "./routes/rotasUsuarios.js"
import rotasCategorias from "./routes/rotasCategorias.js"
import rotasSubCateg from "./routes/rotasSub.js"

const app = express()
testarConexao()

app.use(cors())
app.use(express.json())


app.get("/", (req, res) => {
    res.send("API funcionando...")
})

// ROTAS USUARIOS
app.post("/usuarios", rotasUsuarios.novoUsuario)
app.get("/usuarios", rotasUsuarios.listarTodos)
app.patch("/usuarios/:id", rotasUsuarios.atualizarUsuario)
app.put("/usuarios/:id", rotasUsuarios.atualizarTodosCampos) //nao deu
app.delete("/usuarios/:id", rotasUsuarios.desativarUsuario)
app.get("/usuarios/:id", rotasUsuarios.consultaPorId)

// ROTAS CATEGORIAS
app.post("/categorias", rotasCategorias.novaCategoria)
app.get("/categorias", rotasCategorias.listarTodas)
app.patch("/categorias/:id_categoria", rotasCategorias.atualizarCategoria)
// app.put("/categorias/:id_categoria", rotasCategorias.atualizarTodosCampos)
app.delete("/categorias/:id_categoria", rotasCategorias.desativarCategoria)

// ROTAS SUBCATEGORIAS
app.post("/subcategorias", rotasSubCateg.novaSubCateg)
app.get("/subcategorias", rotasSubCateg.listarTodas)
app.patch("/subcategorias/:id_sub", rotasSubCateg.atualizarSubCateg)
app.delete("/subcategorias/:id_sub", rotasSubCateg.desativarSubCateg)

const porta = 3000
app.listen(porta, () => {
    console.log(`Api rodando em https://localhost:${porta}`)
})