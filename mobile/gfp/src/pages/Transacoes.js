import React, { useState, useEffect, useLayoutEffect } from "react"
import { useIsFocused } from "@react-navigation/native";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native"

import Estilos, { Cores } from "../styles/Estilos"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import CadContas from "./CadContas"

import AsyncStorage from "@react-native-async-storage/async-storage"
import { calcularDatasPeriodo, enderecoServidor, formatarData } from "../utils"
import { TextInput } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker"


export default function Transacoes({navigation}) {
    const [dadosLista, setDadosLista] = useState([])
    const [usuario, setUsuario] = useState({})
    
    // guardando os dados dos filtros 
    const [pesquisa, setPesquisa] = useState("");
    const [filtro, setFiltro] = useState(
        {
            tipo: "todos",
            status: "todos",
            periodo: "esteMes"
        }
    );

    // hook que verifica se a tela está em foco
    const isFocused = useIsFocused()
        
    const buscarDadosAPI = async () => {
        try {

            // setUsuario(await buscarUsuarioLogado());
            // if (!usuario.token) return;
            
            const { dataInicio, dataFim } = calcularDatasPeriodo(filtro.periodo)
            
            const parametros = new URLSearchParams() 
            parametros.append("dataInicio", dataInicio)
            parametros.append("dataFim", dataFim)

            const resposta = await fetch(`${enderecoServidor}/transacoes?${parametros.toString}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${usuario.token}`
                }
            });

                const dados = await resposta.json()
                setDadosLista(dados)
                console.log(dados);
                

        } catch (error) {
            console.error("Erro ao buscar dados", error)
        }
    }
    
    // executa a funçao quando o componente é criado, pois [] está vazio
    useEffect(() => {
        buscarUsuarioLogado()
    }, []) 

    // executa a funçao sempre que ocorrer uma alteraçao na variavel usuario
    useEffect(() => {
        if (isFocused == true) {
            buscarDadosAPI()   
        }    
    }, [usuario, isFocused, filtro.periodo]) 

    const buscarUsuarioLogado = async () => {
            const usuarioLogado = await AsyncStorage.getItem("UsuarioLogado")
            if (usuarioLogado) { // se usuarioLogado NAO estiver vazio
                setUsuario(JSON.parse(usuarioLogado))
            } else {
                navigation.navigate("Login")
            }
        }

    const montarStatus = (item) => {
        const hoje = new Date();
        const vencimento = new Date(item.data_vencimento);
        let status = {}

        if (item.data_pagamento) {
            status = {
                cor: "#70db32",
                icone: "check",
                texto: `Pago em ${formatarData(item.data_pagamento)}`
            }       
        } else if (vencimento < hoje) {
            status = {
                cor: "#bf0b0b",
                icone: "error",
                texto: `Vencido em ${formatarData(item.data_vencimento)}`
            }        
        } else {
            status = {
                cor: "#ffb20c",
                icone: "access-time",
                texto: `Vence em ${formatarData(item.data_vencimento)}`
            }        
        }
        return status;
    }

    const exibirItensLista = ({item}) => {
        const status = montarStatus(item)
        return (
            <TouchableOpacity style={Estilos.itemLista}>
                {/* icone */}
                <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 15,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 10,
                    backgroundColor: item.cor
                }}>
                    <MaterialIcons name={item.icone} size={20} color="#fff" />
                </View>

                {/* informaçoes da transacao */}
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 16, fontWeight: "bold", color: "#333"}}>{item.descricao}</Text>
                    <Text style={{fontSize: 13, color: "#777"}}>{item.nome_subcategoria}</Text>
                    <Text style={{fontSize: 13, color: "#777"}}>{item.nome_conta}</Text>
                    {/* status */}
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <MaterialIcons name={status.icone} color={status.cor} size={14}/>
                        <Text style={{fontSize: 12, marginLeft: 4, fontWeight: 500, color: status.cor}} >{status.texto}</Text>
                    </View>
                </View>

                <View>
                    <Text style={{fontSize: 16, fontWeight: "bold", color: item.tipo == "ENTRADA" ? "#70db32" : "#bf0b0b"}}>R${item.valor}</Text>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <MaterialIcons
                            name="edit" 
                            size={24} 
                            color={Cores.terciaria}
                            onPress={() => navigation.navigate("CadContas", {Conta: item})}
                        />
                            
                        <MaterialIcons
                            name="delete" 
                            size={24} 
                            color={Cores.terciaria}
                            onPress={() => botaoExcluir(item.id_conta)}
                        />
                    </View>
                </View>

            </TouchableOpacity>
        )
    }

    const botaoExcluir = async (id) => {
        try {
            if(!confirm(" tem certexa que deseja excluir?")) return;

            const resposta = await fetch(`${enderecoServidor}/transacoes/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${usuario.token}`
                } 
        })

            // if(!confirm("Tem certeza que deseja excluir?")) return;

            if (resposta.ok) {
                buscarDadosAPI()
            }
            
        } catch (error) {
            console.error("Erro ao excluir")
        }
    }

    // para o botao de + na header
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => {navigation.navigate("CadContas")}}>
                    <MaterialIcons name="add" size={28} color={Cores.branco} style={{marginRight: 8}}/>
                </TouchableOpacity>
            )
        })
    }, [navigation])

    return (
        <View style={Estilos.conteudoHeader}>
            {/* seçao de filtro */}
            <View>
                <TextInput style={Estilos.inputCad} placeholder="Filtrar" value={pesquisa} onChangeText={setPesquisa}/>
                <View>
                    <Text>Período: </Text>
                    <Picker selectedValue={filtro.periodo} onValueChange={(item) => setFiltro({...filtro, período: item})} style={{flex: 1, color: "#333", height: 40}}>
                        <Picker.Item label="Este mês" value="esteMes"/>
                        <Picker.Item label="Mês Passado" value="mesPassado"/>
                        <Picker.Item label="Últimos 7 dias" value="ultimos7"/>
                        <Picker.Item label="Últimos 30 dias" value="ultimos30"/>
                        <Picker.Item label="Todos" value="todos"/>
                    </Picker>
                </View>
            </View>
            <View style={Estilos.conteudoCorpo}>
                <Text>Transações</Text>                
                <FlatList
                    data={dadosLista.filter(item => item.descricao.toLowerCase().includes(pesquisa.toLowerCase()))}
                    renderItem={exibirItensLista}
                    keyExtractor={(item) => item.id_transacao}
                />
            </View>
        </View>
    )
}