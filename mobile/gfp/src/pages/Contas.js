import React, { useState, useEffect, useLayoutEffect } from "react"
import { useIsFocused } from "@react-navigation/native";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native"

import Estilos, { Cores } from "../styles/Estilos"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import CadContas from "./CadContas"

import AsyncStorage from "@react-native-async-storage/async-storage"
import { enderecoServidor } from "../utils"


export default function Contas({navigation}) {
    const [dadosLista, setDadosLista] = useState([])
    const [usuario, setUsuario] = useState({})
    
    // hook que verifica se a tela está em foco
    const isFocused = useIsFocused()
        
    const buscarDadosAPI = async () => {
        try {
            const resposta = await fetch(`${enderecoServidor}/contas`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${usuario.token}`
                } 
            })

            const dados = await resposta.json()
            setDadosLista(dados)

            setDadosLista(dados)
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
    }, [usuario]) 

    const buscarUsuarioLogado = async () => {
            const usuarioLogado = await AsyncStorage.getItem("UsuarioLogado")
            if (usuarioLogado) { // se usuarioLogado NAO estiver vazio
                setUsuario(JSON.parse(usuarioLogado))
            } else {
                navigation.navigate("Login")
            }
        }

    const exibirItensLista = ({item}) => {
        return (
            <TouchableOpacity style={Estilos.itemLista}>
                <Image source={require("../assets/logo.png")} style={Estilos.imagemLista} />
                
                <View style={Estilos.textoListaContainer}>
                    <Text style={[Estilos.nomeLista, Estilos.corLista1]}>{item.nome}</Text>
                    <Text>{item.tipo_conta}</Text>
                </View>

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
            </TouchableOpacity>
        )
    }

    const botaoExcluir = async (id) => {
        try {
            const resposta = await fetch(`${enderecoServidor}/contas/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${usuario.token}`
                } 
        })

            if(!confirm("Tem certeza que deseja excluir?")) return;

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
            <View style={Estilos.conteudoCorpo}>
                <Text>Contas</Text>
                <FlatList
                    data={dadosLista}
                    renderItem={exibirItensLista}
                    keyExtractor={(item) => item.id_conta}
                />
            </View>
        </View>

        // // Essa view cobre toda a tela com o fundo branco
        // <View style={{ flex: 1, backgroundColor: Cores.branco }}>
        //     {/* Essa view representa o topo roxo (Header) */}
        //     <View style={{ height: 60, backgroundColor: Cores.principal }} />
            
        //     {/* Aqui vai o conteúdo com bordas arredondadas */}
        //     <View style={Estilos.conteudoCorpo}>
        //         <Text>Contas</Text>
        //     </View>
        // </View>
    )
}