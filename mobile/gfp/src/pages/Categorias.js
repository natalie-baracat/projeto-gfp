import React, { useState, useEffect, useLayoutEffect } from "react"
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from "react-native"

import Estilos, { Cores } from "../styles/Estilos"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import AsyncStorage from "@react-native-async-storage/async-storage"
import { enderecoServidor } from "../utils"

import CadCategorias from "./CadCategorias";

export default function Categorias({navigation}) {
    const [dadosLista, setDadosLista] = useState([])
    const [usuario, setUsuario] = useState({})
    const [atualizando, setAtualizando] = useState(false)
            
    const buscarDadosAPI = async () => {
        try {
            const resposta = await fetch(`${enderecoServidor}/categorias`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${usuario.token}`
                } 
            })

            const dados = await resposta.json()
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
        buscarDadosAPI()     
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
                {/* ALTERAR PRA IMAGEM E FUNDO DO BD DEPOIS!!! 
                
                colocar uma view com background color: cor do banco de dados
                e uma imagem dentro com o icone do banco de dados  */}

                <View style={{padding: 8, borderRadius: 20, marginRight: 8, backgroundColor: `${item.cor}`}}>
                    <FontAwesome6
                        name={item.icone} 
                        size={17} 
                        color={Cores.icones}
                        // onPress={() => navigation.navigate("CadCategorias", {Conta: item})}
                    />
                </View>

                {/* <Image source={require("../assets/logo.png")} style={Estilos.imagemLista} />  */}
                
                <View style={Estilos.textoListaContainer}>
                    <Text style={[Estilos.nomeLista, Estilos.corLista2]}>{item.nome}</Text>
                    <Text>R$0.00 {/* Tenho que calcular os gasto de cada categoria? eu acho*/}</Text>
                </View>

                <MaterialIcons
                    name="edit" 
                    size={24} 
                    color={Cores.terciaria}
                    onPress={() => navigation.navigate("CadCategorias", {Conta: item})}
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
            const resposta = await fetch(`${enderecoServidor}/categorias/${id}`, {
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
                <TouchableOpacity onPress={() => {navigation.navigate("CadCategorias")}}>
                    <MaterialIcons name="add" size={28} color={Cores.branco} style={{marginRight: 8}}/>
                </TouchableOpacity>
            )
        })
    }, [navigation])


    return (
        <View style={Estilos.conteudoHeader}>
            <View style={Estilos.conteudoCorpo}>
                <Text>Categorias</Text>

                <FlatList
                    data={dadosLista}
                    renderItem={exibirItensLista}
                    keyExtractor={(item) => item.id_categoria}
                    refreshControl={
                        <RefreshControl
                            refreshing={atualizando}
                            onRefresh={buscarDadosAPI}
                            colors={[Cores.terciaria]}
                        />
                    }
                />

            </View>
        </View>
    )
}