import { useNavigate } from "react-router-dom"
import { enderecoServidor } from "../utils/Utils"
import React, { useState, useEffect } from "react";
import Estilos from "../components/Estilos";

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("douglas.camata@gmail.com")
    const [senha, setSenha] = useState("123")
    const [mensagem, setMensagem] = useState("")
    const [lembrar, setLembrar] = useState(false)

    useEffect(() => {
        const buscarUsuarioLogado = async () => {
            const usuarioLogado = await localStorage.getItem("UsuarioLogado")
            if (usuarioLogado) {
                const usuario = JSON.parse(usuarioLogado)
                if (usuario.lembrar == true) {
                    navigate("/principal")
                }
            }
        }

        buscarUsuarioLogado()
    }, [])

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
                localStorage.setItem("UsuarioLogado", JSON.stringify({ ...dados, lembrar }))
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
        setEmail("")
        setSenha("");
        setMensagem("")
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

                <p style={{ color: "#fff", width: "100%" }}>E-mail</p>
                <input
                    style={Estilos.inputDados}
                    onChange={(escritaEmail) => setEmail(escritaEmail.target.value)}
                    value={email}
                    type="text"
                    placeholder="email@sesi.org.br"
                />

                <p style={{ color: "#fff", width: "100%" }}>Senha</p>
                <input
                    style={Estilos.inputDados}
                    onChange={(escritaSenha) => setSenha(escritaSenha.target.value)}
                    onKeyDown={(e) => enterLogin(e)}
                    value={senha}
                    type="password"
                    placeholder="*********"
                />

                <p style={{ color: "red" }}>{mensagem}</p>
            </div>

            <div style={Estilos.containerLembrarMostrar}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                        type="checkbox"
                        name="lembrar"
                        id="lembrar"
                        value={lembrar}
                        checked={lembrar}
                        onChange={(e) => setLembrar(e.target.checked)}
                    />
                    <label htmlFor="lembrar" style={{ color: "#fff" }}>Lembre-se de mim</label>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <button style={{
                        background: "none",
                        border: "none",
                        color: "#aaa",
                        cursor: "pointer"
                    }}>Esqueceu a senha?</button>
                </div>
            </div>

            <button onClick={botaoEntrar} style={Estilos.btnEntrar}>Entrar</button>
        </div>
    )
}
