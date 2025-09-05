import React, { useState, useEffect, useContext } from "react";
import { UsuarioContext } from "../UsuarioContext"
import { useLocation, useNavigate } from "react-router-dom";

import { enderecoServidor, iconesCategoria, listaCores, listaIcones } from "../utils/Utils.jsx"
import { Estilos, Cores } from "../styles/Estilos"

import { MdCreditCard, MdSave, MdClose } from "react-icons/md";

export default function CategoriasModal({modalAberto, fecharModal, itemAlterar}) {
    const { dadosUsuario } = useContext(UsuarioContext);

    const [nome, setNome] = useState("")

    const [descricao, setDescricao] = useState("")
    const [tipoTransacao, setTipoTransacao] = useState("")
    const [gastoFixo, setGastoFixo] = useState("")
    const [cor, setCor] = useState(listaCores[0])
    const [icone, setIcone] = useState(listaIcones[0])

    useEffect(() => {
        if (itemAlterar) {
            setNome(itemAlterar.nome)
            setDescricao(itemAlterar.descricao)
            setTipoTransacao(itemAlterar.tipoTransacao)
            setGastoFixo(itemAlterar.gastoFixo)
            setCor(itemAlterar.cor)
            setIcone(itemAlterar.icone)
        } else {
            setNome("")
            setDescricao("")
        }
    }, [itemAlterar, modalAberto])

    if (modalAberto == false) {
        return null;
    }

    const botaoSalvar = async () => {
        if (nome.trim() == "") {
            alert("Informe o nome da categoria.")
            return;
        }
        const dadosEnviar = {
            // esse nome ANTES dos : deve ser exatamente igual os nomes que coloquei na minha API
            nome: nome,
            descricao: descricao,
            tipo_transacao: tipoTransacao,
            id_usuario: dadosUsuario.id_usuario,
            icone: icone,
            cor: cor,
            gasto_fixo: gastoFixo
        }

        try {
            let endpoint = `${enderecoServidor}/categorias/new`
            let metodo = "POST"
            // se os dados já existirem, o sistema detecta que queremos EDITAR a conta e muda o metodo para PATCH
            if (itemAlterar) {
                endpoint = `${enderecoServidor}/categorias/editar/${itemAlterar.id_conta}`
                metodo = "PUT"
            }

            const resposta = await fetch(endpoint, {
                method: metodo,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${dadosUsuario.token}`
                },
                body: JSON.stringify(dadosEnviar)

            })

            if (resposta.ok) {
                alert("categoria cadastrada com sucesso")
                fecharModal()
            }
        } catch (error) {
            alert("Erro ao salvar conta: " + error.message)
            console.error("Erro ao salvar conta: ", error);
        }

    }

    return (
        <div className="fixed inset-0 py-6 px-4 z-40 backdrop-blur-xs flex justify-center items-center bg-gray-950/5">
            <section className="w-full max-w-2xl bg-white/90 p-8 rounded-lg shadow-lg text-gray-800">
                <header className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-4">
                    <MdCreditCard className={`text-[#710090] h-8 w-8`} />
                    <h2 className="text-2xl font-bold"> {itemAlterar ? "Editar Categoria" : "Nova Categoria"} </h2>
                </header>

                {/* formulario de cadastro */}
                <div className="space-y-5">
                    <div className="flex rounded-md shadow-sm">

                        <button
                            type="button"
                            onClick={() => setTipoTransacao("ENTRADA")}
                            className={`flex-1 rounded-l-md ${tipoTransacao == "ENTRADA" ? "bg-lime-400 text-white" : "bg-gray-300 text-white"}`}
                        >ENTRADA</button>

                        <button
                            type="button"
                            onClick={() => setTipoTransacao("SAIDA")}
                            className={`flex-1 rounded-r-md ${tipoTransacao == "SAIDA" ? "bg-red-500 text-white" : "bg-gray-300 text-white"}`}
                        >SAÍDA</button>

                    </div>

                    {/* input nome categoria e gasto fixo*/}
                    <div className="flex items-center justify-between">
                        <div className="w-3/4">
                            <label className={Estilos.labelCadastro}>Nome da categoria*</label>
                            <input type="text" value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder='Ex.: Alimentação'
                                className={Estilos.inputCadastro}
                                required />
                        </div>
                        <div className="mt-7">
                            <input type="checkbox" checked={gastoFixo} onChange={(e) => setGastoFixo(e.target.checked)} />
                            <label className="ml-1">Gasto fixo?</label>
                        </div>
                    </div>

                    <label className={Estilos.labelCadastro}>Descrição da categoria</label>
                    <input type="text" value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        placeholder='Ex.: Gastos nos restaurantes'
                        className={Estilos.inputCadastro} />

                    <label className={Estilos.labelCadastro}>Escolha uma cor</label>
                    <div className={Estilos.listaItensModalCategorias}>
                        {
                            listaCores.map((corItem) => (
                                <div
                                    key={corItem}
                                    onClick={() => setCor(corItem)}
                                    style={{ backgroundColor: corItem }}
                                    className={`
                                        ${Estilos.iconeCorBotaoModal} 
                                        ${cor == corItem ? "ring-2 ring-offset-2 ring-purple-600" : ""}`
                                    }
                                />
                            ))
                        }
                    </div>
                    <label className={Estilos.labelCadastro}>Escolha um ícone</label>
                    <div className={Estilos.listaItensModalCategorias}>
                        {
                            listaIcones.map((iconeItem) => (
                                <div
                                    key={iconeItem}
                                    onClick={() => setCor(iconeItem)}
                                    style={{ backgroundColor: cor }}
                                    className={`
                                        ${Estilos.iconeCorBotaoModal} 
                                        ${cor == iconeItem ? "ring-2 ring-offset-2 ring-purple-600" : ""}`
                                    }
                                >
                                    {iconesCategoria[iconeItem]}
                                </div>
                            ))
                        }
                    </div>


                    {/* Botões de Controle */}
                    <div className='flex justify-end gap-3 mt-8'>
                        <button className={Estilos.botaoOutline} onClick={() => fecharModal()}>
                            <MdClose /> Cancelar
                        </button>
                        <button className={Estilos.botao2} onClick={botaoSalvar}>
                            <MdSave /> Salvar
                        </button>
                    </div>
                </div>
            </section>
        </div>

    )
}