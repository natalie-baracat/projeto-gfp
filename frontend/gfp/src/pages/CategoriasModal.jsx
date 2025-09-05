import React, { useState, useEffect, useContext } from "react";
import { UsuarioContext } from "../UsuarioContext"
import { enderecoServidor } from "../utils/Utils.jsx"
import { MdCreditCard, MdSave, MdClose } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { Estilos, Cores } from "../styles/Estilos"

export default function CategoriasModal(modalAberto, fecharModal, itemAlterar) {
    const { dadosUsuario } = useContext(UsuarioContext);

    const [nome, setNome] = useState("")


    useEffect(() => {
        if (itemAlterar) {
            setNome(itemAlterar.nome)
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
            // esse nome antes da virgula deve ser exatamente igual os nomes que coloquei na minha API
            nome: nome,
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
        <div className="fized inset-0 py-6 px-4 z-50">
            <section className="w-full max-w-2xl bg-white/90 p-8 rounded-lg shadow-lg text-gray-800">
                <header className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-4">
                    <MdCreditCard className={`text-[#710090] h-8 w-8`} />
                    <h2 className="text-2xl font-bold"> { itemAlterar ? "Editar Categoria" : "Nova Categoria"} </h2>
                </header>

                {/* formulario de cadastro */}
                <div className="space-y-5">
                    <label className={Estilos.labelCadastro}>Nome da categoria</label>
                    <input type="text" value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder='Ex.: Alimentação'
                        className={Estilos.inputCadastro} />

                    {/* Botões de Controle */}
                    <div className='flex justify-end gap-3 mt-8'>
                        <button className={Estilos.botaoOutline} onClick={() => fecharModal()}>
                            <MdClose /> Cancelar
                        </button>
                        <button className={Estilos.botao} onClick={botaoSalvar}>
                            <MdSave /> Salvar
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}