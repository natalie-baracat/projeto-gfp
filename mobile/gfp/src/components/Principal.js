import { useState, useEffect } from "react"
import { Text, View, TouchableOpacity } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Cores } from "../styles/Estilos"

export default function Principal({ navigation }) {
    const [usuario, setUsuario] = useState({})

    useEffect(()=> {
        const buscarUsuarioLogado = async () => {
            const usuarioLogado = await AsyncStorage.getItem("UsuarioLogado")
            if (usuarioLogado) { // se usuarioLogado NAO estiver vazio
                setUsuario(JSON.parse(usuarioLogado))
            } else {
                navigation.navigate("Login")
            }
        }
        buscarUsuarioLogado()
    }, [])

    const botaoLogout = () => {
        AsyncStorage.removeItem("UsuarioLogado")
        navigation.navigate("Login")
    }

    return (
        <View>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <Text>Usuário: {usuario.nome} </Text>
                {/* também da pra fazer assim (se eu fosse deixar o useState la em cima como (null). signifia: "se usuario nao for null" */}
                {/* <Text>Usuário: {usuario?.nome} </Text>*/} 

                <TouchableOpacity onPress={botaoLogout} style={{backgroundColor: Cores.terciaria, paddingHorizontal: 8, paddingVertical: 5}}>
                        <Text style={{color: Cores.textos}}>Sair</Text>
                </TouchableOpacity>
            </View>
            <Text>Principal</Text>
        </View>
    )
}