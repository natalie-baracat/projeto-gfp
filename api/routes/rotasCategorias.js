import { BD } from "../db.js";

class rotasCategorias {
    // nova categoria
    static async novaCategoria(req, res) {
        const { nome, tipo_transacao, gasto_fixo, id_usuario } = req.body
        try {
            const categoria = await BD.query(`
                INSERT INTO categorias(nome, tipo_transacao, gasto_fixo, id_usuario)
                    VALUES($1, $2, $3, $4)
                `, [nome, tipo_transacao, gasto_fixo, id_usuario])

            // outro jeito: 
            // const query = `INSERT INTO categorias(nome, tipo_transacao, gasto_fixo, id_usuario) VALUES($1, $2, $3, $4)`
            // const valores = [nome, tipo_transacao, gasto_fixo, id_usuario]
            // const resposta = await BD.query(query, valores)

            res.status(201).json("Categoria cadastrada com sucesso")
        } catch (error) {
            console.error("Erro ao criar categoria", error)
            res.status(500).json({
                message: "Erro ao criar categoria",
                error: error.message
            })
        }
    }

    // rota de leitura
    static async listarTodas(req, res) {
        try {
            const categorias = await BD.query("SELECT * FROM categorias WHERE ativo = TRUE ") // nao exibe os categoria inativos
            return res.status(200).json(categorias.rows)
        } catch (error) {
            res.status(500).json({message:
                "Erro ao listar categorias — ", error: error.message
            })            
        }
    }

    // rota de atualizaçao INDIVIDUAL
    // funçao para atualizar os valores individualmente caso necessario
    static async atualizarCategoria(req, res) {
        const { id_categoria } = req.params
        const { nome, tipo_transacao, gasto_fixo, id_usuario } = req.body

        try {
            // inicializa arrays para armazenar os campos (ex: nome, email) e valores (ex: $1, $2, ... $n) a serem atualizados
            const campos = []
            const valores = []

            // verificar quais campos foram fornecidos
            if (nome !== undefined) {
                campos.push(`nome = $${valores.length + 1}`)
                valores.push(nome)
            }
            
            if (tipo_transacao !== undefined) {
                campos.push(`tipo_transacao = $${valores.length + 1}`)
                valores.push(tipo_transacao)
            }

            if (gasto_fixo !== undefined) {
                campos.push(`gasto_fixo = $${valores.length + 1}`)
                valores.push(gasto_fixo)
            }
            
            if (id_usuario !== undefined) {
                campos.push(`id_usuario = $${valores.length + 1}`)
                valores.push(id_usuario)
            }

            if(campos.length === 0) {
                return res.status(400).json({message: "Nenhum campo adicionado para atualização"})
            }

            // adicionar o id ao final do array valores
            valores.push(id_categoria)

            // montamos a query dinamicamente
            const query = `UPDATE categorias
                            SET ${campos.join(", ")}
                            WHERE id_categoria = $${valores.length}
                            RETURNING *`

            // executando nossa query
            const categoria = await BD.query(query, valores)

            // verifica se o categoria foi atualizado
            if(categoria.rows.length === 0) {
                return res.status(404).json({message: "Categoria não encontrado"})
            }

            // se tudo der certo
            return res.status(200).json(categoria.rows[0])
            

        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }



    // rota de inativaçao
    static async desativarCategoria(req, res) {
        const {id_categoria} = req.params
        // const { ativo } = req.body // METODO DELETE NÃO TEM BODY!! nessecaso nao posso usar

        try {
            const resultado = await BD.query (`
                UPDATE categorias
                SET ativo = FALSE
                WHERE id_categoria = $1
            `, [id_categoria])
    
            return res.status(200).json({message: "Categoria desativada"})
            
        } catch (error) {
            console.error("Erro ao desativar categoria: ", error)
            return res.status(500).json({message: "Erro ao desativar categoria", error: error.message})            
        }
    }
}

export default rotasCategorias