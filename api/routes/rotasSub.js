import { BD } from "../db.js";

class rotasSubCateg {
    // nova categoria
    static async novaSubCateg(req, res) {
        const { nome, id_categoria, gasto_fixo } = req.body
        try {
            const subcategoria = await BD.query(`
                INSERT INTO subcategorias(nome, id_categoria, gasto_fixo)
                    VALUES($1, $2, $3)
                `, [nome, id_categoria, gasto_fixo])

            // outro jeito: 
            // const query = `INSERT INTO categorias(nome, id_categoria, gasto_fixo) VALUES($1, $2, $3, $4)`
            // const valores = [nome, id_categoria, gasto_fixo]
            // const resposta = await BD.query(query, valores)

            res.status(201).json("Subcategoria cadastrada com sucesso")
        } catch (error) {
            console.error("Erro ao criar subcategoria", error)
            res.status(500).json({
                message: "Erro ao criar subcategoria",
                error: error.message
            })
        }
    }

    // rota de leitura
    static async listarTodas(req, res) {
        try {
            const subcategoria = await BD.query(`
                SELECT sub.id_subcategoria, sub.nome, sub.gasto_fixo, c.nome AS Categoria FROM subcategorias AS sub
	                INNER JOIN categorias AS c 
                    ON sub.id_categoria = c.id_categoria 
                    WHERE sub.ativo = TRUE
                `)
            return res.status(200).json(subcategoria.rows)
        } catch (error) {
            res.status(500).json({message:
                "Erro ao listar subcategoria — ", error: error.message
            })            
        }
    }

    // rota de atualizaçao INDIVIDUAL
    // funçao para atualizar os valores individualmente caso necessario
    static async atualizarSubCateg(req, res) {
        const { id_sub } = req.params
        const { nome, id_categoria, gasto_fixo } = req.body

        try {
            // inicializa arrays para armazenar os campos (ex: nome, email) e valores (ex: $1, $2, ... $n) a serem atualizados
            const campos = []
            const valores = []

            // verificar quais campos foram fornecidos
            if (nome !== undefined) {
                campos.push(`nome = $${valores.length + 1}`)
                valores.push(nome)
            }
            
            if (id_categoria !== undefined) {
                campos.push(`id_categoria = $${valores.length + 1}`)
                valores.push(id_categoria)
            }

            if (gasto_fixo !== undefined) {
                campos.push(`gasto_fixo = $${valores.length + 1}`)
                valores.push(gasto_fixo)
            }

            if(campos.length === 0) {
                return res.status(400).json({message: "Nenhum campo adicionado para atualização"})
            }

            // adicionar o id ao final do array valores
            valores.push(id_sub)

            // montamos a query dinamicamente
            const query = `UPDATE subcategorias
                            SET ${campos.join(", ")}
                            WHERE id_subcategoria = $${valores.length}
                            RETURNING *`

            // executando nossa query
            const sub = await BD.query(query, valores)

            // verifica se o sub foi atualizado
            if(sub.rows.length === 0) {
                return res.status(404).json({message: "Subcategoria não encontrada"})
            }

            // se tudo der certo
            return res.status(200).json(sub.rows[0])
            

        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }


    // rota de inativaçao
    static async desativarSubCateg(req, res) {
        const {id_sub} = req.params
        // const { ativo } = req.body // METODO DELETE NÃO TEM BODY!! nessecaso nao posso usar

        try {
            const resultado = await BD.query (`
                UPDATE subcategorias
                SET ativo = FALSE
                WHERE id_subcategoria = $1
            `, [id_sub])
    
            return res.status(200).json({message: "Subegoria desativada"})
            
        } catch (error) {
            console.error("Erro ao desativar subegoria: ", error)
            return res.status(500).json({message: "Erro ao desativar subcategoria", error: error.message})            
        }
    }

     // consulta por id
     static async consultaPorId(req, res) {
        const { id } = req.params
        try {
            const subCateg = await BD.query("SELECT * FROM subcategorias WHERE id_subcategoria = $1", [id])
            return res.status(200).json(subCateg.rows)
        } catch (error) {
            res.status(500).json({message: "Erro ao consultar local da transação", error: error.message})
        }
    }
}

export default rotasSubCateg