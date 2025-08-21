import React, { useState, useEffect, useContext } from "react";
import { UsuarioContext } from "../UsuarioContext"
import { enderecoServidor } from "../utils/Utils.jsx"
import { MdAdd, MdEdit, MdDelete, MdCreditCard, MdAccountBalance, MdEmail, MdFeaturedPlayList, MdAttachMoney, MdAutoGraph } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Estilos } from "../styles/Estilos"

export default function Contas() {
    const { dadosUsuario, setDadosUsuario, carregando } = useContext(UsuarioContext);
    const [dadosLista, setDadosLista] = useState([]);

    const buscarDadosAPI = async () => {
        try {
            const resposta = await fetch(`${enderecoServidor}/contas`, {
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

    const botaoExcluir = async (id_conta) => {
        try {
            const resposta = await fetch(`${enderecoServidor}/contas/${id_conta}`, {
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


        const iconesTipoConta = {
        "CONTA_CORRENTE": <MdAccountBalance className="w-6 h-6"/>,
        "POUPANCA": <MdEmail className="w-6 h-6"/>,
        "CARTAO_CREDITO": <MdCreditCard className="w-6 h-6"/>,
        "CARTAO_DEBITO": <MdFeaturedPlayList className="w-6 h-6"/>,
        "DINHEIRO": <MdAttachMoney className="w-6 h-6"/>,
        "INVESTIMENTO": <MdAutoGraph className="w-6 h-6"/>,
    }
    
    const nomesTipoConta = {
        "CONTA_CORRENTE": "Conta Corrente",
        "POUPANCA": "Poupança",
        "CARTAO_CREDITO": "Cartão de crédito",
        "CARTAO_DEBITO": "Cartão de Débito",
        "DINHEIRO": "Dinheiro",
        "INVESTIMENTO": "Investimento",
    }

    const exibirItensLista = (item) => {
        return (
            <div key={item.id} className={Estilos.linhaListagem}>
                <div className="p-2 bg-pink-200 text-pink-500 rounded-full">
                    {/* <MdCreditCard className="w-6 h-6" /> */}
                    {iconesTipoConta[item.tipo_conta]}
                </div>

                <div className="flex-1 ml-4">
                    <p className="font-bold text-gray-800">{item.nome}</p>
                    <p className="font-bold text-gray-500">{ nomesTipoConta[item.tipo_conta] }</p>
                </div>

                <div className="flex items-center space-x-2">
                    <button className={Estilos.botaoAlterar}><MdEdit className="h-6 w-6" /></button>
                    <button className={Estilos.botaoExcluir} onClick={() => botaoExcluir(item.id_conta)}><MdDelete className="h-6 w-6" /></button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <p className="text-3xl font-bold mb-6" >Contas</p>
            <section className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Gerenciar Contas</h3>
                    <button onClick={() => navigate("/cadcontas")} className={Estilos.botaoCadastro}>
                        <MdAdd className="h-8 w-8" /> Nova conta
                    </button>
                </div>
                {/* lista de contas cadstradas */}
                <section className="">
                    {dadosLista.map(item => exibirItensLista(item))}
                </section>
            </section>
        </div>
    )
}