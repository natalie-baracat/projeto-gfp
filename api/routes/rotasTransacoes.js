import { BD } from "../db.js";

class rotasTransacoes {
    // nova categoria
    static async novaTransacao(req, res) {
        const { nome, valor, descricao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual } = req.body
        try {
            const transacao = await BD.query(`
                INSERT INTO transacoes(nome, valor, descricao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual)
                    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                `, [nome, valor, descricao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual])

            // outro jeito: 
            // const query = `INSERT INTO categorias(nome, valor, descricao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual) VALUES($1, $2, $3, $4)`
            // const valores = [nome, valor, descricao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual]
            // const resposta = await BD.query(query, valores)

            res.status(201).json("transação cadastrada com sucesso")
        } catch (error) {
            console.error("Erro ao criar transação", error)
            res.status(500).json({
                message: "Erro ao criar transação",
                error: error.message
            })
        }
    }
}

export default rotasTransacoes