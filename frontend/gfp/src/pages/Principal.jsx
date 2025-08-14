import { useState, useEffect, useContext } from "react"
import { UsuarioContext } from "../UsuarioContext"
import { useNavigate, Link, Routes, Route, useLocation } from "react-router-dom"
import Dashboard from "./Dashboard"
import logo from "../assets/logo.png"
import { MdAdd, MdClose, MdGridView, MdLogout } from "react-icons"

export default function Principal() {
    const { dadosUsuario, setDadosUsuario, carregando } = useContext(UsuarioContext)

    const [menuAberto, setMenuAberto] = useState(false);

    const navigate = useNavigate()

    const location = useLocation() // obtem localizaçao atual

    useEffect(()=> {
        if (!dadosUsuario && !carregando) { // se nao houver dados de usuario (null) e se nao estiver carregando
            navigate("/login")
        }
    }, [dadosUsuario, carregando, navigate])

    const botaoLogout = () => {
        localStorage.removeItem("UsuarioLogado")
        setDadosUsuario(null)
        navigate("/login")
    }

    return (
        <div>
            <div flex h-screen font-sans bg-gradient>

                 {/* ? significa que se os dados for nulo, apenas deixara em branco, em vez de dar erro */}
                {/* <span>Usuário: {dadosUsuario?.nome} </span> */}

                <button onClick={botaoLogout}>Sair</button>
            </div>
            <span>Principal</span>
        </div>
    )
}