import React, { useState, useEffect, useContext } from "react";
import { UsuarioContext } from "../UsuarioContext"
import { calcularDatasPeriodo, enderecoServidor, listaCores, formatarDinheiro } from "../utils/Utils.jsx"
import {  MdAutoAwesome, MdTrendingUp, MdTrendingDown, MdWallet } from "react-icons/md";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useNavigate } from "react-router-dom";
import { Estilos } from "../styles/Estilos"
import CardIndicador from "../components/CardIndicador.jsx";

export default function Dashboard() {
    const { dadosUsuario } = useContext(UsuarioContext);
    const [dadosDash, setDadosDash] = useState({
        kpis: {despesas: 0, receitas: 0},
        categorias: [],
        subcategorias: [],
        vencimentos: [],
        evolucao6meses: [],
    })
    const [filtro, setFiltro] = useState(
            {
                periodo: "todos",
                tipo: "todos",
                status: "todos"
            }
        );
    const [carregando, setCarregando] = useState(true)

    // variaveis de estado para a analise de IA
    const [analise, setAnalise] = useState("")
    const [carregandoAnalise, setCarregandoAnalise] = useState(null)
    const [erroAnalise, setErroAnalise] = useState(null)
    const [modalAnaliseAberto, setModalAnaliseAberto] = useState(false)

    const buscarDadosAPI = async () => {
        try {
            const { dataInicio, dataFim} = calcularDatasPeriodo(filtro.periodo)

            const parametros = new URLSearchParams();
            parametros.append("dataInicio", dataInicio);
            parametros.append("dataFim", dataFim);

            setCarregando(true);

            const resposta = await fetch(`${enderecoServidor}/transacoes/dados-dashboard?${parametros.toString()}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${dadosUsuario.token}`
                }
            });
            const dados = await resposta.json();
            setDadosDash(dados);

            console.log("dados", dados);

        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    }

    useEffect(() => {
        if (!carregando || dadosUsuario) {
            buscarDadosAPI();
        }
    }, [dadosUsuario, filtro.periodo]);

    const ModalAnalise = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Análise Financeira com IA</h2>
                    <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
                </div>
                <div className="min-h-[200px]">
                    {carregandoAnalise && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="mt-4 text-gray-600">Analisando suas finanças...</p>
                        </div>
                    )}
                    {erroAnalise && <p className="text-red-700 bg-red-50 p-4 rounded-lg">{erroAnalise}</p>}
                    {analise && <div className="prose max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed">{analise}</div>}
                </div>
                <div className="flex justify-end mt-6 pt-4 border-t">
                    <button onClick={() => setModalAberto(false)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Fechar</button>
                </div>
            </div>
        </div>
    );

    // "ultima funçao de react" - prof douglas sendo dramatik
    const analiseComIA = async () => {
        setCarregandoAnalise(true)
        setErroAnalise(null)
        setAnalise("")
        setModalAnaliseAberto(true)

        try {
            // prompt pro chat gpt
            const prompt = `Você é um consultor financeiro inteligente. Analise os seguintes dados que estou enviando: 
                - Receitas: ${dadosDash.kpis.receitas}
                - Despesas: ${dadosDash.kpis.despesas}
                - Detalhamento de despesas por categoria: ${dadosDash.categorias}
                - Detalhamento de despesas por subcategoria: ${dadosDash.subcategorias}
                - Últimos 6 meses: ${dadosDash.evolucao6meses}

                Com base nisso, forneça uma análise objetiva e curta (máx 300 palavras):
                1. Uma avaliação geral da saúde financeira deste período.
                2. Aponte a categoria e subcategoria que mais impactou as despesas (se necessário)

            `

            const apiKey = "CHAVE"

            const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{role: "user", content: prompt}],
                    max_tokens: 300,
                    temperature: 0.7
                })
            });
            const dados = await resposta.json();
            setAnalise(dados.choices[0].message.content);
            console.log("dadosIA", dados)
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            setCarregandoAnalise(false)
        }
    }

    return (
        <div>
            {/* cabeçalho com filtro e botao de analise */}
            <section className="flex mb-8 justify-between items-center gap-4 sm:flex-row">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Dashboard Financeiro</h1>
                    <h1 className="text-gray mb-2">Resumo de suas finanças</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div>
                        <select 
                            className={"w-full bg-transparent px-4 py-2 rounded-lg shadow-sm border-amber-100/60  border-1 focus:outline-none"}
                            value={filtro.periodo}
                            onChange={(e) => setFiltro({...filtro, periodo: e.target.value})}>
                            <option value="esteMes" className="text-gray-800"> Este mês</option>
                            <option value="mesPassado" className="text-gray-800"> Mês passado</option>
                            <option value="ultimos7" className="text-gray-800"> Últimos 7 dias</option>
                            <option value="ultimos30" className="text-gray-800"> Últimos 30 dias</option>
                            <option value="todos" className="text-gray-800"> Todos</option>
                        </select>
                    </div>
                </div>
                <button onClick={analiseComIA} className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-tr from-[#b30098] to-[#ffb20c] hover:brightness-105 hover:shadow-md hover:shadow-[#b30098]/50 hover:cursor-pointer">
                    <MdAutoAwesome className="h-6 w-6"/> Analisar com IA
                </button>
            </section>

            {/* seçao 1: cars de indicadores (ou kPIs) */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                <CardIndicador titulo={"Painel de Receitas"} valor={formatarDinheiro(dadosDash.kpis.receitas)} cor={"#70db32"} icone={<MdTrendingUp className="w-9 h-9"/>}/>
                <CardIndicador titulo={"Painel de Despesas"} valor={formatarDinheiro(dadosDash.kpis.despesas)} cor={"#f03056"} icone={<MdTrendingDown className="w-9 h-9"/>}/>
                <CardIndicador titulo={"Saldo"} valor={formatarDinheiro(dadosDash.kpis.receitas - dadosDash.kpis.despesas)} cor={"#5fc5c7"} icone={<MdWallet className="w-9 h-9"/>}/>
            </section>

            {/* seçao 2: graficos */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Despesas por categoria</h3>

                    { dadosDash.categorias.length == 0 ? 
                        <p className="text-gray-500 text-center">Nenhuma despesa registrada no período </p> :
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={dadosDash.categorias} dataKey={"valor"} nameKey={"nome"} label={(item) => item.nome} >
                                    {
                                        dadosDash.categorias.map((item, index) => (
                                            <Cell key={index} fill={listaCores[index % listaCores.length]}/>
                                        ))
                                    }
                                    <Tooltip/> {/* cardizinho que aparecem quando hover */}
                                    <Legend/>
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    }
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Despesas por subcategoria</h3>

                    { dadosDash.subcategorias.length == 0 ? 
                        <p className="text-gray-500 text-center">Nenhuma despesa registrada no período </p> :
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={dadosDash.subcategorias} dataKey={"valor"} nameKey={"nome"} label={(item) => item.nome} >
                                    {
                                        dadosDash.subcategorias.map((item, index) => (
                                            <Cell key={index} fill={listaCores[index % listaCores.length]}/>
                                        ))
                                    }
                                    <Tooltip/> {/* cardizinho que aparecem quando hover */}
                                    <Legend/>
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    }
                </div>
            </section>

            {/* seçao 3: grafico ultimos 6 meses */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Últimos 6 meses</h3>
                    <div className="space-y-3">
                         <ResponsiveContainer width="100%" height={300}>
                           <BarChart data={dadosDash.evolucao6meses}>
                            <XAxis dataKey="mes" fontSize={12}/>
                            <YAxis/>
                            <Legend/>

                            <Bar dataKey="total_receitas" fill="#70db32" name="Receitas" radius={[7,7,0,0]}/>
                            <Bar dataKey="total_despesas" fill="#f03056" name="Despesas" radius={[7,7,0,0]}/>
                            <Tooltip/>

                           </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>

            {/* seçao 4: listagens */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Próximos vencimentos</h3>
                    <div className="space-y-3">
                        { dadosDash.vencimentos.length == 0 ? 
                        <p className="text-gray-500 text-center">Nenhum registro no período </p> :
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={dadosDash.subcategorias} dataKey={"valor"} nameKey={"nome"} label={(item) => item.nome} >
                                    {
                                        dadosDash.subcategorias.map((item, index) => (
                                            <Cell key={index} fill={listaCores[index % listaCores.length]}/>
                                        ))
                                    }
                                    <Tooltip/> {/* cardizinho que aparecem quando hover */}
                                    <Legend/>
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    }
                        
                    </div>
                </div>
            </section>
            
            {modalAnaliseAberto == true ? <ModalAnalise/> : null}

        </div>
    )
}