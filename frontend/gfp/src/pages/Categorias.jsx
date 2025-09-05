import React, { useState, useEffect, useContext } from "react";
import { UsuarioContext } from "../UsuarioContext.jsx"
import { enderecoServidor, iconesCategoria, tipoTransacao } from "../utils/Utils.jsx"
import { useNavigate } from "react-router-dom";

import { Estilos } from "../styles/Estilos.jsx"
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import CategoriasModal from "./CategoriasModal.jsx";


export default function Categorias() {
    const { dadosUsuario, setDadosUsuario, carregando } = useContext(UsuarioContext);
    const [dadosLista, setDadosLista] = useState([]);

    // variaveis para controle do Modal
    const [modalAberto, setModalAberto] = useState(false)
    const [itemAlterar, setItemAlterar] = useState(null)

    const fecharModal = () => {
        setModalAberto(false)
        setItemAlterar(null)
        buscarDadosAPI()
    }

    const botaoAlterar = (item) => {
        setCategoriaParaEditar(item)
        setModalAberto(true)
    }

    const navigate = useNavigate();

    const buscarDadosAPI = async () => {
        try {
            const resposta = await fetch(`${enderecoServidor}/categorias`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${dadosUsuario.token}`
                }
            });
            const dados = await resposta.json();
            setDadosLista(dados);
            console.log("dados", dados);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    }

    useEffect(() => {
        if (!carregando || dadosUsuario) {
            buscarDadosAPI();
        }
    }, [dadosUsuario]);

    const botaoExcluir = async (id_categoria) => {
        try {
            const resposta = await fetch(`${enderecoServidor}/categorias/${id_categoria}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${dadosUsuario.token}`
                }
            })

            if (!window.confirm("Tem certeza que deseja excluir?")) return;

            if (resposta.ok) {
                buscarDadosAPI()
            }

        } catch (error) {
            console.error("Erro ao excluir")
        }
    }
    
    const exibirItensLista = (item) => {
        const isSaida = tipoTransacao[item.tipo_transacao]; //pra mudar a cor do texto e bg quando for saida ou entrada
        return (
            <div key={item.id_categoria} className={Estilos.linhaListagem}>
                <div className={`p-2 text-gray-50 rounded-full`} style={{ backgroundColor: item.cor || "#cccccc" }}>
                    {iconesCategoria[item.icone]}
                </div>

                <div className="flex-1 ml-4">
                    <p className="font-bold text-gray-800">{item.nome}</p>

                    {/* jeito que eu fiz abaixo */}
                    <span className={isSaida ? "bg-red-200 text-red-500 rounded-full pb-0.5 px-2 font-medium text-center text-xs"  : "bg-green-200 text-green-500 rounded-full pb-0.5 px-3 font-medium text-center text-xs" }>
                        {isSaida ? "Saída" : "Entrada"}
                    </span>

                    {/* jeito que o professor fez abaixo. nao precisa do import da utils nem is isSaida */}
                    {/* <span className={`text-xs font-semibold px-2 py-1 rounded-full
                            ${item.tipo_transacao == 'SAIDA' ? 'bg-red-200 text-red-500' : 'bg-green-200 text-green-600'}`}>
                        {item.tipo_transacao}
                    </span> */}

                </div>

                <div className="flex items-center space-x-2">
                    <button className={Estilos.botaoAlterar} onClick={() => botaoAlterar(item)} ><MdEdit className="h-6 w-6" /></button>
                    <button className={Estilos.botaoExcluir} onClick={() => botaoExcluir(item.id_categoria)}><MdDelete className="h-6 w-6" /></button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <p className="text-3xl font-bold mb-6" >Categorias</p>
            <section className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Gerenciar categorias</h3>
                    <button onClick={() => setModalAberto(true)} className={Estilos.botaoCadastro}>
                        <MdAdd className="h-8 w-8" /> Nova categoria
                    </button>
                </div>
                {/* lista de categorias cadastradas */}
                <section className="">
                    {dadosLista.map(item => exibirItensLista(item))}
                </section>
            </section>

            <CategoriasModal
                modalAberto={modalAberto}
                fecharModal={fecharModal}
                itemAlterar={itemAlterar}
            />
        </div>
    )
}