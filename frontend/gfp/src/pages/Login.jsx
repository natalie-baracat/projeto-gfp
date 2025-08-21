import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import { UsuarioContext } from "../UsuarioContext";
import { enderecoServidor } from "../utils/Utils.jsx";


export default function Login() {
    const { dadosUsuario, setDadosUsuario} = useContext(UsuarioContext)
    const navigate = useNavigate();
    const [email, setEmail] = useState("missdiagnosis@ppth");
    const [senha, setSenha] = useState("jw");
    const [mensagem, setMensagem] = useState("");
    const [lembrar, setLembrar] = useState(false);

    useEffect(() => {
        const buscarUsuarioLogado = async () => {
            const usuarioLogado = await localStorage.getItem("UsuarioLogado");
            if (usuarioLogado) {
                const usuario = JSON.parse(usuarioLogado);
                if (usuario.lembrar === true) {
                    setDadosUsuario(dados)
                    navigate("/principal"); //essa rota nao existe mais
                }
            }
        };
        buscarUsuarioLogado();
    }, []);

    const botaoEntrar = async (e) => {
        e.preventDefault();
        try {
            if (email === "" || senha === "") {
                throw new Error("Preencha todos os campos.");
            }

            const resposta = await fetch(`${enderecoServidor}/usuarios/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha })
            });

            /*
                OBS:
                ⬇ chave do objeto   ⬇ valor que será digitado pelo usuario
                email            :  email,
                senha            :  senha
            */
            if (resposta.ok) {
                const dados = await resposta.json();
                localStorage.setItem("UsuarioLogado", JSON.stringify({ ...dados, lembrar }));
                setDadosUsuario(dados)
                navigate("/principal"); //essa rota nao existe mais
            } else {
                setMensagem("Email ou senha incorretos");
                throw new Error("Email ou senha incorretos");
            }
        } catch (error) {
            console.error("Erro ao realizar login: ", error);
            alert(error.message);
        }
    };

    // nao precisava mas quis fazer hehe
    const enterLogin = (e) => {
        if (e.key === "Enter") {
            botaoEntrar(e);
        }
    };

    const styles = {
        container: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            // backgroundColor: "#f7f7f7",
            fontFamily: "Arial, sans-serif"
        },
        card: {
            // background: "#fff",
            /* From https://css.glass */
            background: "rgba(255, 255, 255, 0.9)",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(7.7px)",
            // -webkit-backdrop-filter: "blur(7.7px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            padding: "2rem",
            borderRadius: "16px",
            // boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "350px"
        },
        title: {
            textAlign: "center",
            marginBottom: "1.5rem"
        },
        input: {
            width: "100%",
            padding: "0.8rem",
            margin: "0.5rem 0",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "1rem"
        },
        message: {
            color: "red",
            fontSize: "0.9rem",
            textAlign: "center",
            marginTop: "0.5rem"
        },
        checkboxContainer: {
            display: "flex",
            alignItems: "center",
            marginTop: "0.8rem"
        },
        linkButton: {
            background: "none",
            border: "none",
            color: "#007bff",
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: "0.9rem",
            padding: 0
        },
        loginButton: {
            width: "100%",
            padding: "0.8rem",
            backgroundColor: "#710090",
            border: "none",
            borderRadius: "5px",
            color: "white",
            fontSize: "1rem",
            marginTop: "1rem",
            cursor: "pointer"
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Boas vindas novamente!</h1>

                <input
                    style={styles.input}
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="text"
                    placeholder="E-mail"
                />

                <input
                    style={styles.input}
                    onChange={(e) => setSenha(e.target.value)}
                    onKeyDown={enterLogin}
                    value={senha}
                    type="password"
                    placeholder="Senha"
                />

                {mensagem && <p style={styles.message}>{mensagem}</p>}

                <div style={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        id="lembrar"
                        checked={lembrar}
                        onChange={(e) => setLembrar(e.target.checked)}
                    />
                    <label htmlFor="lembrar" style={{ marginLeft: "0.5rem" }}>Lembre-se de mim</label>
                </div>

                <div>
                    <button style={styles.linkButton}>Esqueceu a senha?</button>
                </div>

                <button style={styles.loginButton} onClick={botaoEntrar}>
                    Entrar
                </button>
            </div>
        </div>
    );
}
