import { BD } from "../db.js";

class rotasLocalTransacao {
    // nova categoria
    static async novoLocalTrans(req, res) {
        const { nome, id_local_transacao, tipo_local, saldo } = req.body
        try {
            const localTransacao = await BD.query(`
                INSERT INTO local_transacao(nome, id_local_transacao, tipo_local, saldo)
                    VALUES($1, $2, $3, $4)
                `, [nome, id_local_transacao, tipo_local, saldo])

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
}

export default rotasLocalTransacao