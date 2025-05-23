import { BD } from "../db.js";

class rotasContas {
    // nova categoria
    static async novaConta(req, res) {
        const { nome, tipo_conta, saldo, conta_padrao } = req.body
        try {
            const contas = await BD.query(`
                INSERT INTO contas(nome, tipo_conta, saldo, conta_padrao)
                    VALUES($1, $2, $3, $4)
                `, [nome, tipo_conta, saldo, conta_padrao])

            // outro jeito: 
            // const query = `INSERT INTO categorias(nome, id_conta, tipo_conta, saldo, conta_padrao) VALUES($1, $2, $3, $4)`
            // const valores = [nome, id_conta, tipo_conta, saldo, conta_padrao]
            // const resposta = await BD.query(query, valores)

            res.status(201).json("Conta cadastrada com sucesso")
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
            const contas = await BD.query(`
                SELECT id_conta, nome, tipo_conta, saldo
                FROM contas
                WHERE ativo = true
                `)
            return res.status(200).json(contas.rows)
        } catch (error) {
            res.status(500).json({message:
                "Erro ao listar  — ", error: error.message
            })            
        }
    }

    // rota de atualizaçao INDIVIDUAL
    // funçao para atualizar os valores individualmente caso necessario
    static async atualizarConta(req, res) {
        const { id } = req.params
        const { nome, tipo_conta, saldo, campo_padrao } = req.body

        try {
            // inicializa arrays para armazenar os campos (ex: nome, email) e valores (ex: $1, $2, ... $n) a serem atualizados
            const campos = []
            const valores = []

            // verificar quais campos foram fornecidos
            if (nome !== undefined) {
                campos.push(`nome = $${valores.length + 1}`)
                valores.push(nome)
            }
            
            if (tipo_conta !== undefined) {
                campos.push(`tipo_conta = $${valores.length + 1}`)
                valores.push(tipo_conta)
            }

            if (saldo !== undefined) {
                campos.push(`saldo = $${valores.length + 1}`)
                valores.push(saldo)
            }

            if (campo_padrao !== undefined) {
                campos.push(`campo_padrao = $${valores.length + 1}`)
                valores.push(campo_padrao)
            }

            if(campos.length === 0) {
                return res.status(400).json({message: "Nenhum campo adicionado para atualização"})
            }

            // adicionar o id ao final do array valores
            valores.push(id)

            // montamos a query dinamicamente
            const query = `UPDATE contas
                            SET ${campos.join(", ")}
                            WHERE id_conta = $${valores.length}
                            RETURNING *`

            // executando nossa query
            const sub = await BD.query(query, valores)

            // verifica se o sub foi atualizado
            if(sub.rows.length === 0) {
                return res.status(404).json({message: " não encontrada"})
            }

            // se tudo der certo
            return res.status(200).json(sub.rows[0])
            

        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }

    // rota de inativaçao
    static async desativarConta(req, res) {
        const { id } = req.params
        // const { ativo } = req.body // METODO DELETE NÃO TEM BODY!! nessecaso nao posso usar

        try {
            const resultado = await BD.query (`
                UPDATE contas
                SET ativo = FALSE
                WHERE id_conta = $1
            `, [id])
    
            return res.status(200).json({message: "Conta desativada"})
            
        } catch (error) {
            console.error("Erro ao desativar Conta: ", error)
            return res.status(500).json({message: "Erro ao desativar", error: error.message})            
        }
    }

    // consulta por id
    static async consultaPorId(req, res) {
        const { id } = req.params
        try {
            const local_trans = await BD.query("SELECT * FROM contas WHERE id_conta = $1", [id])
            return res.status(200).json(local_trans.rows)
        } catch (error) {
            res.status(500).json({message: "Erro ao consultar conta", error: error.message})
        }
    }

     // filtrar por tipo 
    static async filtrarConta(req, res) {
        const { nome } = req.query

        try {
            const query = `
                SELECT * FROM  contas 
                WHERE nome LIKE $1 AND ativo = true
                ORDER BY id_conta DESC
            `
            const valores = [`%${nome}%`] // antes eu tava colocando direto na query (LIKE '%$1%'), por isso tava dando erro

            const resposta = await BD.query(query, valores)

            return res.status(200).json(resposta.rows)
        } catch (error) {
            console.error("Erro ao filtrar conta", error)
            res.status(500).json({message: "Erro ao filtrar conta", error: error.message})
        }
    }


}

export default rotasContas