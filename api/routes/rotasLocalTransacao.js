import { BD } from "../db.js";

class rotasLocalTransacao {
    // nova categoria
    static async novoLocalTrans(req, res) {
        const { nome, tipo_local, saldo } = req.body
        try {
            const localTransacao = await BD.query(`
                INSERT INTO local_transacao(nome, tipo_local, saldo)
                    VALUES($1, $2, $3)
                `, [nome, tipo_local, saldo])

            // outro jeito: 
            // const query = `INSERT INTO categorias(nome, id_local_transacao, tipo_local, saldo) VALUES($1, $2, $3, $4)`
            // const valores = [nome, id_local_transacao, tipo_local, saldo]
            // const resposta = await BD.query(query, valores)

            res.status(201).json("cadastrada com sucesso")
        } catch (error) {
            console.error("Erro ao criar", error)
            res.status(500).json({
                message: "Erro ao criar",
                error: error.message
            })
        }
    }

    static async listarTodas(req, res) {
        try {
            const local_transacao = await BD.query(`
                SELECT id_local_transacao, nome, tipo_local, saldo 
                FROM local_transacao
                WHERE ativo = true
                `)
            return res.status(200).json(local_transacao.rows)
        } catch (error) {
            res.status(500).json({message:
                "Erro ao listar  — ", error: error.message
            })            
        }
    }

    // rota de atualizaçao INDIVIDUAL
    // funçao para atualizar os valores individualmente caso necessario
    static async atualizarLocalTrans(req, res) {
        const { id } = req.params
        const { nome, tipo_local, saldo } = req.body

        try {
            // inicializa arrays para armazenar os campos (ex: nome, email) e valores (ex: $1, $2, ... $n) a serem atualizados
            const campos = []
            const valores = []

            // verificar quais campos foram fornecidos
            if (nome !== undefined) {
                campos.push(`nome = $${valores.length + 1}`)
                valores.push(nome)
            }
            
            if (tipo_local !== undefined) {
                campos.push(`tipo_local = $${valores.length + 1}`)
                valores.push(tipo_local)
            }

            if (saldo !== undefined) {
                campos.push(`saldo = $${valores.length + 1}`)
                valores.push(saldo)
            }

            if(campos.length === 0) {
                return res.status(400).json({message: "Nenhum campo adicionado para atualização"})
            }

            // adicionar o id ao final do array valores
            valores.push(id)

            // montamos a query dinamicamente
            const query = `UPDATE local_transacao
                            SET ${campos.join(", ")}
                            WHERE id_local_transacao = $${valores.length}
                            RETURNING *`

            // executando nossa query
            const sub = await BD.query(query, valores)

            // verifica se o sub foi atualizado
            if(sub.rows.length === 0) {
                return res.status(404).json({message: " não encontrado"})
            }

            // se tudo der certo
            return res.status(200).json(sub.rows[0])
            

        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }

    // rota de inativaçao
    static async desativarLocalTrans(req, res) {
        const { id } = req.params
        // const { ativo } = req.body // METODO DELETE NÃO TEM BODY!! nessecaso nao posso usar

        try {
            const resultado = await BD.query (`
                UPDATE local_transacao
                SET ativo = FALSE
                WHERE id_local_transacao = $1
            `, [id])
    
            return res.status(200).json({message: "Local transacao desativada"})
            
        } catch (error) {
            console.error("Erro ao desativar Local transacao: ", error)
            return res.status(500).json({message: "Erro ao desativar", error: error.message})            
        }
    }

}

export default rotasLocalTransacao