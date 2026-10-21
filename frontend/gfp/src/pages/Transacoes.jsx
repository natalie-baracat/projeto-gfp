import React, { useState, useEffect, useContext } from "react";
import { UsuarioContext } from "../UsuarioContext"
import { calcularDatasPeriodo, enderecoServidor, formatarData, iconesCategoria, iconesTipoConta, nomesTipoConta } from "../utils/Utils.jsx"
import { MdAdd, MdEdit, MdDelete, MdDone, MdCheckCircle, MdError, MdAccessTime, MdSearch } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Estilos } from "../styles/Estilos"

export default function Transacoes() {
    const { dadosUsuario, setDadosUsuario, carregando } = useContext(UsuarioContext);
    const [dadosLista, setDadosLista] = useState([]);

    const navigate = useNavigate();

    // guardando os dados dos filtros 
    const [pesquisa, setPesquisa] = useState("");
    const [filtro, setFiltro] = useState(
        {
            tipo: "todos",
            status: "todos",
            periodo: "esteMes"
        }
    );

    const buscarDadosAPI = async () => {
        try {
            const { dataInicio, dataFim } =calcularDatasPeriodo(filtro.periodo)

            const parametros = new URLSearchParams() 
            parametros.append("dataInicio", dataInicio)
            parametros.append("dataFim", dataFim)

            const resposta = await fetch(`${enderecoServidor}/transacoes?${parametros.toString()}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${dadosUsuario.token}`
                }
            });
            const dados = await resposta.json();
            setDadosLista(dados);
            console.log("dados: ", dados);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    }

    useEffect(() => {
        if (!carregando || dadosUsuario) {
            buscarDadosAPI();
        }
    }, [dadosUsuario, filtro.periodo]);

    const botaoExcluir = async (id_transacao) => {
        try {
            const resposta = await fetch(`${enderecoServidor}/transacoes/${id_transacao}`, {
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


    const botaoQuitar = async (id_conta) => {
            try {
                // criando objeto para atualizar a data de pagamento da transaçao
                const dados = {
                    data_pagamento: new Date().toISOString().slice(0,10)
                }
                const resposta = await fetch(`${enderecoServidor}/contas/${id_conta}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type":"application/json",
                        "Authorization": `Bearer ${dadosUsuario.token}`
                    },
                    body: JSON.stringify(dados)
                })
    
                if (!window.confirm("Tem certeza que deseja excluir?")) return;
    
                if (resposta.ok) {
                    buscarDadosAPI()
                }
    
            } catch (error) {
                console.error("Erro ao excluir")
            }
        }

    const montarStatus = (item) => {
        const hoje = new Date();
        const vencimento = new Date(item.data_vencimento);
        let status = {}

        if (item.data_pagamento) {
            status = {
                cor: "text-green-600",
                icone: <MdCheckCircle className="h-4 w-4"/>,
                texto: `Pago em ${formatarData(item.data_pagamento)}`
            }       
        } else if (vencimento < hoje) {
            status = {
                cor: "text-red-600",
                icone: <MdError className="h-4 w-4"/>,
                texto: `Vencido em ${formatarData(item.data_vencimento)}`
            }        
        } else {
            status = {
                cor: "text-yellow-600",
                icone: <MdAccessTime className="h-4 w-4"/>,
                texto: `Vence em ${formatarData(item.data_vencimento)}`
            }        
        }
        return status
    }
    
    const exibirItensLista = (item) => {
        const status = montarStatus(true);
        return (
            <section key={item.id_transacao} className={Estilos.linhaListagem}>
                <div className={`p-2 text-white rounded-full`} style={{ backgroundColor: item.cor }}>
                    {iconesCategoria[item.icone]}
                </div>

                <div className='flex-1 p-2' >
                    {/* descricao */}
                    <p className='text-gray-800 font-semibold text-sm truncate'>{item.descricao}</p>
                    <div className='flex justify-between items-center'>
                        <div >
                            {/* subcategoria */}
                            <p className='text-sm text-gray-500 truncate'>{item.nome_subcategoria}</p>

                            {/* conta */}
                            <p className="text-sm text-gray-500 truncate">{item.nome_conta}</p>

                            {/* status */}
                            <div className={`flex items-center text-xs gap-1 ${status.cor}`}>
                            {status.icone}
                            <span>{status.texto}</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            {/* valor */}
                            <p className={`font-bold ${item.tipo_transacao == "ENTRADA" ? "text-lime-500" : "text-red-600"}`}>
                                R${parseFloat(item.valor).toFixed(2)}
                            </p>

                            {/* botoes */}
                            <div className="flex items-center space-x-2">
                                {/* se o campo data_pagamento estiver preenchido, o botao de quitar nao é mostrado e vice versa */}
                                {!item.data_pagamento && <button className={Estilos.botaoQuitar} onClick={() => botaoQuitar(item.id_transacao)} ><MdDone className="h-6 w-6" /></button>}
                            
                                <button className={Estilos.botaoExcluir} onClick={() => botaoExcluir(item.id_transacao)}><MdDelete className="h-6 w-6" /></button>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <div>
            <p className="text-3xl font-bold mb-6" >Transações</p>
            <section className="bg-white p-4 rounded-lg shadow-md text-gray-600">
                {/* filtros */}
                <div className="flex justify-between items-center mb-3 gap-2 flex-wrap">
                    {/* div da barra de pesquisa */}
                    <div className="flex-1 min-w-48">
                        <label>Busca</label>
                            <div className="relative mt-1">
                                <MdSearch className="absolute top-3 left-3 text-gray-400"/>
                                <input 
                                    type="text" placeholder="Buscar transação" 
                                    className={`${Estilos.inputCadastro} pl-9 placeholder-gray-400`}  
                                    value={pesquisa}
                                    onChange={(e) => setPesquisa(e.target.value)}
                                    />

                            </div>
                    </div>

                    {/* div do periodo */}
                    <div className="flex-1 min-w-48">
                        <label>Período</label>
                        <select 
                            className={`${Estilos.inputCadastro} placeholder-gray-400 mt-1`}
                            value={filtro.periodo}
                            onChange={(e) => setFiltro({...filtro, periodo: e.target.value})}
                        >
                            <option value="esteMes">Este mês</option>
                            <option value="mesPassado">Mês passado</option>
                            <option value="ultimos7">Últimos 7 dias</option>
                            <option value="ultimos30">Últimos 30 dias</option>
                            <option value="todos">Todos</option>
                        </select>
                    </div>
                   
                    {/* div do Tipo */}
                    <div className="flex-1 min-w-48">
                        <label>Tipo</label>
                        <select
                            className={`${Estilos.inputCadastro} placeholder-gray-400 mt-1`}
                            value={filtro.tipo}
                            onChange={(e) => setFiltro({...filtro, tipo: e.target.value})}
                        >
                            <option value="ENTRADA">Entrada</option>
                            <option value="SAIDA">Saída</option>
                            <option value="todos">Todos</option>
                        </select>
                    </div>
                   
                    {/* div do Status */}
                    <div className="flex-1 min-w-48">
                        <label>Status</label>
                        <select className={`${Estilos.inputCadastro} placeholder-gray-400 mt-1`}>
                            <option value="todos">Todos</option>
                            <option value="aberto">Em aberto</option>
                            <option value="vencidos">Vencidos</option>
                            <option value="pagos">Pagos</option>
                        </select>
                    </div>
                </div>
                {/* lista de transacoes cadastradas */}
                <section className="">
                    {dadosLista
                    .filter(item => item.descricao.toLowerCase().includes(pesquisa.toLowerCase()))
                    .filter(item => filtro.tipo == "todos" ? true : item.tipo_transacao == filtro.tipo)
                    .filter(item => 
                        filtro.status == "todos" || 
                        (filtro.status == "pagos" && item.data_pagamento != null) ||
                        (filtro.status == "aberto" && item.data_pagamento == null && new Date(item.data_vencimento) >= new Date()) ||
                        (filtro.status == "vencidos" && item.data_pagamento == null && new Date(item.data_vencimento) < new Date())
                    )
                    .map(item => exibirItensLista(item))}
                </section>
            </section>
        </div>
    )
}