import { useNavigate, Link } from "react-router-dom"
import { enderecoServidor } from "../utils/Utils"
import React, { useState } from "react";
import Estilos, { Cores } from "../components/Estilos";

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [mensagem, setMensagem] = useState('')

    const botaoEntrar = async (e) => {
        e.preventDefault()
        try {
            if (email == "" || senha == "") { throw new Error("Preencha todos os campos.") }

            // autenticando utilizando a API com o fetch
            const resposta = await fetch(`${enderecoServidor}/usuarios/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        senha: senha
                    })
                }
            )
            /*
                OBS:
                ⬇ chave do objeto   ⬇ valor que será digitado pelo usuario
                email            :  email,
                senha            :  senha
            */

            if (resposta.ok) {
                const dados = await resposta.json()
                localStorage.setItem("infoUsuarioLogado", JSON.stringify(dados))
                navigate("/principal")
            } else {
                setMensagem("Email ou senha incorretos")
                throw new Error("Email ou senha incorretos")
            }
        } catch (error) {
            console.error("Erro ao realzar login: ", error)
            alert(error.message)
            return
        }
    }

    const limpaForm = () => {
        setEmail('')
        setSenha('');
        setMensagem('')
    }

    // nao precisava mas quis fazer hehe
    const enterLogin = (e) => {
        if (e.key == "Enter") {
            botaoEntrar(e)
        }
    }

    return (
        <div style={Estilos.conteudo}>

            <div>
                <h1 style={Estilos.loginTitle}>Boas vindas novamente!</h1>

                <p>E-mail</p>
                <input style={Estilos.inputDados} onChange={(escritaEmail) => setEmail(escritaEmail.target.value)} value={email} type="text" placeholder='email@sesi.org.br' />

                <p>Senha</p>
                <input style={Estilos.inputDados} onChange={(escritaSenha) => setSenha(escritaSenha.target.value)}
                    onKeyDown={(e) => enterLogin(e)} value={senha} type="password" placeholder='*********' />

                <p>{mensagem}</p>
            </div>

            <button onClick={botaoEntrar}>Entrar</button>
        </div>
    )
}