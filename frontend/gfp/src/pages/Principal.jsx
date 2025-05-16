import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"

export default function Principal({ navigation }) {
    const [usuario, setUsuario] = useState({})
    const navigate = useNavigate()

    useEffect(()=> {
        const buscarUsuarioLogado = async () => {
            const usuarioLogado = await localStorage.getItem("UsuarioLogado")
            if (usuarioLogado) { // se usuarioLogado NAO estiver vazio
                setUsuario(JSON.parse(usuarioLogado))
            } else {
                navigate("/")
            }
        }
        buscarUsuarioLogado()
    }, [])

    const botaoLogout = () => {
        localStorage.removeItem("UsuarioLogado")
        navigate("/")
    }

    return (
        <div>
            <div>
                <span>Usuário: {usuario.nome} </span>
                {/* também da pra fazer assim (se eu fosse deixar o useState la em cima como (null). signifia: "se usuario nao for null" */}
                {/* <span>Usuário: {usuario?.nome} </span>*/} 

                <button onClick={botaoLogout}>Sair</button>
            </div>
            <span>Principal</span>
        </div>
    )
}