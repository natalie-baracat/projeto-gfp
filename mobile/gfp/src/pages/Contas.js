import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useState, useEffect, useLayoutEffect } from "react"
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native"
import Estilos, { Cores } from "../styles/Estilos"
import { enderecoServidor } from "../utils"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


export default function Contas({navigation}) {
    const [dadosLista, setDadosLista] = useState([])
    const [usuario, setUsuario] = useState({})
        
    const buscarDadosAPI = async () => {
        try {
            const resposta = await fetch(`${enderecoServidor}/contas,
                method: "GET",
                headers: {
                    'Authorization': Bearer ${usuario.token}
                } 
            `)

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
    }, [usuario] ) 

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
                    <Text>{item.tipo_conta}</Text>
                    <Text style={Estilos.nomeLista}>{item.nome}</Text>
                </View>
                <MaterialIcons name="edit" size={24} color={Cores.terciaria}/>
                <MaterialIcons name="delete" size={24} color={Cores.terciaria}
                onPress={() => botaoExcluir(item.id_conta)}
                />
            </TouchableOpacity>
        )
    }

    const botaoExcluir = async (id) => {
        try {
            const resposta = await fetch(`${enderecoServidor}/contas/${id},
                method: "DELETE",
                headers: {
                    'Authorization': Bearer ${usuario.token}
                } 
            `)

            if (resposta.ok) {
                buscarDadosAPI()
            }
            
        } catch (error) {
            console.error("Erro ao excluir")
        }
    }
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