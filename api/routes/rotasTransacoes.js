// feito por natalie dyva

import { BD } from "../db.js";

class rotasTransacoes {
    // nova categoria
    static async novaTransacao(req, res) {
        const { valor, descricao, data_vencimento, data_pagamento, tipo_transacao, id_conta, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual } = req.body
        try {
            const transacao = await BD.query(`
                INSERT INTO transacoes(valor, descricao, data_vencimento, data_pagamento, tipo_transacao, id_conta, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual)
                    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                `, [valor, descricao, data_vencimento, data_pagamento, tipo_transacao, id_conta, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual])

            // outro jeito: 
            // const query = `INSERT INTO categorias(valor, descricao, data_vencimento, data_pagamento, tipo_transacao, id_conta, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual) VALUES($1, $2, $3, $4)`
            // const valores = [valor, descricao, data_vencimento, data_pagamento, tipo_transacao, id_conta, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual]
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

    // rota de leitura
    static async listarTodas(req, res) {
        try {
            const transacao = await BD.query(`
                SELECT 
                    	trans.id_transacao, 
                        usr.nome,
                        trans.valor, 
                        trans.tipo_transacao,
                        contas.saldo,
                        trans.descricao, 
                        trans.num_parcelas,
                        trans.parcela_atual,
                        cat.nome AS categoria,
                        subcat.nome AS subcategoria,
                        trans.data_transacao,
                        trans.data_vencimento,
                        trans.data_pagamento,
                        contas.nome AS conta
	
                FROM transacoes AS trans

                INNER JOIN contas ON trans.id_conta = contas.id_conta
                INNER JOIN categorias AS cat ON trans.id_categoria = cat.id_categoria
                INNER JOIN usuarios as usr ON trans.id_usuario = usr.id_usuario 
                LEFT JOIN subcategorias AS subcat ON trans.id_subcategoria = subcat.id_subcategoria

                WHERE usr.ativo = true

                `)
            return res.status(200).json(transacao.rows)

        } catch (error) {
            res.status(500).json({message:
                "Erro ao listar transacao — ", error: error.message
            })            
        }
    } 

        // rota de atualizaçao INDIVIDUAL
    // funçao para atualizar os valores individualmente caso necessario
    static async atualizarTrans(req, res) {
        const { id_transacao } = req.params
        const { valor, descricao, data_vencimento, data_pagamento, tipo_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual, id_conta} = req.body

        try {
            // inicializa arrays para armazenar os campos (ex: nome, email) e valores (ex: $1, $2, ... $n) a serem atualizados
            const campos = []
            const valores = []

            // verificar quais campos foram fornecidos
            if (valor !== undefined) {
                campos.push(`valor = $${valores.length + 1}`)
                valores.push(valor)
            }
            
            if (descricao !== undefined) {
                campos.push(`descricao = $${valores.length + 1}`)
                valores.push(descricao)
            }

            if (data_vencimento !== undefined) {
                campos.push(`data_vencimento = $${valores.length + 1}`)
                valores.push(data_vencimento)
            }
            
            if (data_pagamento !== undefined) {
                campos.push(`data_pagamento = $${valores.length + 1}`)
                valores.push(data_pagamento)
            }
            
            if (tipo_transacao !== undefined) {
                campos.push(`tipo_transacao = $${valores.length + 1}`)
                valores.push(tipo_transacao)
            }
            
            if (id_categoria !== undefined) {
                campos.push(`id_categoria = $${valores.length + 1}`)
                valores.push(id_categoria)
            }
            
            if (id_subcategoria !== undefined) {
            campos.push(`id_subcategoria = $${valores.length + 1}`)
            valores.push(id_subcategoria)
            }

            if (id_usuario !== undefined) {
            campos.push(`id_usuario = $${valores.length + 1}`)
            valores.push(id_usuario)
            }

            if (num_parcelas !== undefined) {
            campos.push(`num_parcelas = $${valores.length + 1}`)
            valores.push(num_parcelas)
            }

            if (parcela_atual !== undefined) {
            campos.push(`parcela_atual = $${valores.length + 1}`)
            valores.push(parcela_atual)
            }
            
            if (id_conta !== undefined) {
            campos.push(`id_conta = $${valores.length + 1}`)
            valores.push(id_conta)
            }

            if(campos.length === 0) {
                return res.status(400).json({message: "Nenhum campo adicionado para atualização"})
            }

            // adicionar o id ao final do array valores
            valores.push(id_transacao)

            // montamos a query dinamicamente
            const query = `UPDATE transacoes
                            SET ${campos.join(", ")}
                            WHERE id_transacao = $${valores.length}
                            RETURNING *`

            // executando nossa query
            const transacao = await BD.query(query, valores)

            // verifica se o transacao foi atualizado
            if(transacao.rows.length === 0) {
                return res.status(404).json({message: "transação não encontrado"})
            }

            // se tudo der certo
            return res.status(200).json(transacao.rows[0])
            

        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }


    // rota de inativaçao
    static async desativarTrans(req, res) {
        const { id } = req.params
        // const { ativo } = req.body // METODO DELETE NÃO TEM BODY!! nessecaso nao posso usar

        try {
            const resultado = await BD.query (`
                UPDATE transacoes
                SET ativo = FALSE
                WHERE id_transacao = $1
            `, [id])
    
            return res.status(200).json({message: "transacao desativada"})
            
        } catch (error) {
            console.error("Erro ao desativar transacao: ", error)
            return res.status(500).json({message: "Erro ao desativar transacao", error: error.message})            
        }
    }

    // consulta por id
    static async consultaPorId(req, res) {
        const { id } = req.params
        try {
            const transacao = await BD.query("SELECT * FROM transacoes WHERE id_transacao = $1", [id])
            return res.status(200).json(transacao.rows)
        } catch (error) {
            res.status(500).json({message: "Erro ao consultar transação", error: error.message})
        }
    }

      // rota de inativaçao
    static async desativarTrans(req, res) {
        const {id_sub} = req.params
        // const { ativo } = req.body // METODO DELETE NÃO TEM BODY!! nessecaso nao posso usar

        try {
            const resultado = await BD.query (`
                UPDATE transacoes
                SET ativo = FALSE
                WHERE id_transacao = $1
            `, [id_sub])
    
            return res.status(200).json({message: "transação desativada"})
            
        } catch (error) {
            console.error("Erro ao desativar transação: ", error)
            return res.status(500).json({message: "Erro ao desativar transação", error: error.message})            
        }
    }

    // filtrar por data de vencimento ou pagamento ou um intervalo especifico
    static async filtrarPorData(req, res) {
        const { data_inicio, data_fim, tipo_data } = req.query

        let colunaData 

        if (tipo_data == "vencimento") {
            colunaData = "data_vencimento"
        }
        else if (tipo_data == "pagamento") {
            colunaData = "data_pagamento"
        } else {
            return res.status(400).json({
                message: 'Tipo de data inválido — utilize "vencimento" ou "pagamento"'
            })
        }

        try {
            const query = `
                SELECT trans.*, u.nome AS nome_usuario, contas.nome
                FROM transacoes AS trans
                LEFT JOIN usuarios AS u ON trans.id_usuario = u.id_usuario
                JOIN contas ON trans.id_conta = contas.id_conta
                WHERE ${colunaData} BETWEEN $1 AND $2
                ORDER BY ${colunaData} ASC
            `

            const transacoes =  await BD.query(query, [data_inicio, data_fim])

            res.status(200).json(transacoes.rows)
        } catch (error) {
            console.error("Erro ao filtrar transação: ", error)
            return res.status(500).json({message: "Erro ao filtrar transação", error: error.message})   
        }
    }

}

export default rotasTransacoes