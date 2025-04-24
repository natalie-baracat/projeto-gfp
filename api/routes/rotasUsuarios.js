import { BD } from "../db.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";


const SECRET_KEY = "chave_api_gfp"

class rotasUsuarios {
    static async novoUsuario(req, res) {
        const { nome, email, senha, tipo_acesso } = req.body

        const saltRounds = 10
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds)
        try {
            // const usuario = await BD.query(`
            //     INSERT INTO usuarios(nome, email, senha, tipo_acesso)
            //         VALUES($1, $2, $3, $4)
            //     `, [nome, email, senhaCriptografada, tipo_acesso])

            // outro jeito: 
            const query = `INSERT INTO usuarios(nome,email, senha, tipo_acesso) VALUES($1, $2, $3, $4)`
            const valores = [nome, email, senhaCriptografada, tipo_acesso]
            const resposta = await BD.query(query, valores)

            res.status(201).json("Usuário cadastrado com sucesso")
        } catch (error) {
            console.error("Erro ao criar usuário", error)
            res.status(500).json({
                message: "Erro ao criar usuário",
                error: error.message
            })
        }
    }

    // rota de login

    static async login(req, res){
        const { email, senha } = req.body

        try {
            // validaçao
            const resultado = await BD.query(`
                SELECT *
                FROM usuarios
                WHERE email = $1 AND ativo = true`, 
                [email]
            )

            if (resultado.rows === 0) {
                return res.status(401).json({message: "Email inválido"})
            }

            const usuario = resultado.rows[0]
            const senhaValida = await bcrypt.compare(senha, usuario.senha)

            if (!senhaValida) {
                return res.status(401).json({message: "Senha incorreta"})
            }

            // geracao de um novo token (JWT) para o usuario
            const token = jwt.sign(
                // payload
                {
                    id: usuario.id_usuario, 
                    nome: usuario.nome, 
                    email: usuario.email
                },
                // chave
                SECRET_KEY,
                // tempo ate ser expirado
                {
                    expiresIn: "1h"
                }
            )

            return res.status(200).json(
                { 
                    token, 
                    id_usuario: usuario.id_usuario, 
                    nome: usuario.nome, 
                    email: usuario.email,
                    tipo_acesso: usuario.tipo_acesso,
                }
            )

        } catch (error) {
            console.error("Erro ao realizar login: ", error)
            return res.status(500).json({message: "Erro ao fazer login", error: error.message})
        }
    }

    // rota de leitura
    static async listarTodos(req, res) {
        try {
            const usuarios = await BD.query("SELECT * FROM usuarios WHERE ativo = TRUE ORDER BY id_usuario") // nao exibe os usuarios inativos
            return res.status(200).json(usuarios.rows)
        } catch (error) {
            res.status(500).json({message:
                "Erro ao listar usuários — ", error: error.message
            })            
        }
    }

    // rota de atualizaçao INDIVIDUAL
    // funçao para atualizar os valores individualmente caso necessario
    static async atualizarUsuario(req, res) {
        const { id } = req.params
        const { nome, email, senha, tipo_acesso } = req.body

        try {
            // inicializa arrays para armazenar os campos (ex: nome, email) e valores (ex: $1, $2, ... $n) a serem atualizados
            const campos = []
            const valores = []

            // verificar quais campos foram fornecidos
            if (nome !== undefined) {
                campos.push(`nome = $${valores.length + 1}`)
                valores.push(nome)
            }
            
            if (email !== undefined) {
                campos.push(`email = $${valores.length + 1}`)
                valores.push(email)
            }

            if (senha !== undefined) {
                campos.push(`senha = $${valores.length + 1}`)
                valores.push(senha)
            }
            
            if (tipo_acesso !== undefined) {
                campos.push(`tipo_acesso = $${valores.length + 1}`)
                valores.push(tipo_acesso)
            }

            if(campos.length === 0) {
                return res.status(400).json({message: "Nenhum campo adicionado para atualização"})
            }

            // adicionar o id ao final do array valores
            valores.push(id)

            // montamos a query dinamicamente
            const query = `UPDATE usuarios
                            SET ${campos.join(", ")}
                            WHERE id_usuario = $${valores.length}
                            RETURNING *`

            // executando nossa query
            const usuario = await BD.query(query, valores)

            // verifica se o usuario foi atualizado
            if(usuario.rows.length === 0) {
                return res.status(404).json({message: "Usuário não encontrado"})
            }

            // se tudo der certo
            return res.status(200).json(usuario.rows[0])
            

        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }


    // rota de atualizaçao de todos os campos
    // static async atualizarTodosCampos(req, res) {
    //     const { id_usuario } = req.params
    //     const { nome, email, senha, tipo_acesso } = req.body
    //     try {
    //         const usuario = await BD.query(`
    //             UPDATE usuarios SET nome = $1, email = $2, senha = $3, tipo_acesso = $4
    //                 WHERE id_usuario = $5 RETURNING *`, [nome, email, senha, tipo_acesso, id_usuario]
    //         )
    //         res.status(200).json(usuario.rows)
    //     } catch (error) {
    //         res.status(500).json({message: "Erro ao atualizar usuário", error: error.message})
    //     }
    // }


    static async atualizarTodosCampos(req, res) {
        // const { id_usuario } = req.params;
        const id = parseInt(req.params.id_usuario);

        const { nome, email, senha, tipo_acesso } = req.body;
    
        try {
            const query = `
                UPDATE usuarios 
                SET nome = $1, email = $2, senha = $3, tipo_acesso = $4
                WHERE id_usuario = $5 
                RETURNING *;
            `;
    
            const values = [nome, email, senha, tipo_acesso, id];
    
            console.log("Query:", query);
            console.log("Values:", values);
    
            const usuario = await BD.query(query, values);
    
            res.status(200).json(usuario.rows);
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error); // Manda o erro que sair aqui
            res.status(500).json({
                message: "Erro ao atualizar usuário",
                error: error.message
            });
        }
    }
    
    // consulta por id
    static async consultaPorId(req, res) {
        const { id } = req.params
        try {
            const usuario = await BD.query("SELECT * FROM usuarios WHERE id_usuario = $1", [id])
            return res.status(200).json(usuario.rows)
        } catch (error) {
            res.status(500).json({message: "Erro ao consultar usuário", error: error.message})
        }
    }

    // rota de inativaçao
    static async desativarUsuario(req, res) {
        const {id_usuario} = req.params
        // const { ativo } = req.body // METODO DELETE NÃO TEM BODY!! nessecaso nao posso usar

        try {
            const resultado = await BD.query (`
                UPDATE usuarios
                SET ativo = FALSE
                WHERE id_usuario = $1
            `, [id_usuario])
    
            return res.status(200).json({message: "Usuário desativado"})
            
        } catch (error) {
            console.error("Erro ao desativar usuário: ", error)
            return res.status(500).json({message: "Erro ao desativar usuário", error: error.message})            
        }
    }
}

// funçao middleware para proteger rotas privadas
export function autenticarToken(req, res, next) {
    // extrair o cabecalho (header) da requisiçao do token
    const token = req.headers["authorization"] // Bearer<token>
    console.log(token)
    // verificar se o token foi fornecido na requisicao
    if (!token) return res.status(403).json({mensagem: "Token não fornecido"}) // nao preciso abrir {} no if se houver apenas uma linha de comando
    console.log("Passou do if")
    // verificar se o token é valido — jwt.verify que valida se o token é legitimo
    jwt.verify(token.split(" ")[1], SECRET_KEY, (err, usuario) => {
        // se der erro
        if (err) return res.status(403).json({mensagem: "Token inválido"}) 

        // se o token for valido, adiciona os dados do usuario (decodificados no token), tornando essas informaçoes disponiveis nas rotas que precisam da autenticaçao
        
        req.usuario = usuario
        next()
    })
    console.log("Passou do jwt")
    
}

export default rotasUsuarios