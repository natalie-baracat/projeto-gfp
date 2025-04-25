import { View, Text, TextInput, TouchableOpacity, ImageBackground, Dimensions } from "react-native"
import Estilos, { Cores } from "../styles/Estilos"
import { enderecoServidor } from "../utils"
import React, { useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from "expo-linear-gradient"

export default function Login({ navigation }) {

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const botaoEntrar = async () => {
        try {
            if (email == "" || senha == "") { throw new Error("Preencha todos os campos.") }

            // autenticando utilizando a API com o fetch
            const resposta = await fetch(`${enderecoServidor}/usuarios/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        senha: senha
                    })
                }
            )
            /*
                OBS:
                ⬇ chave do objeto   ⬇ valor que será digitado pelo usuario
                email            :  email,
                senha            :  senha
            */

            if (resposta.ok) {
                const dados = await resposta.json()
                AsyncStorage.setItem("infoUsuarioLogado", JSON.stringify(dados))
                navigate("/principal")
            } else {
                setMensagem("Email ou senha incorretos")
                throw new Error("Email ou senha incorretos")
            }
        } catch (error) {
            console.error("Erro ao realzar login: ", error)
            alert(error.message)
            return
        }
    }

    const limpaForm = () => {
        setEmail('')
        setSenha('');
        setMensagem('')
    }

    const { width, height } = Dimensions.get('window');

    return (
        <ImageBackground
            source={require("../assets/fundocelular.png")}
            // style={{ flex: 1 }}  // <- pega a tela toda
            // resizeMode="cover"   // <- preenche sem sobrar nada

            // só deus (e o chat) sabem como demorou pra descobrir esse metodo do dimensions (que foi o que mais deu certo)
            style={{ width: width, height: height }}
            resizeMode="cover"
        >
            <View style={Estilos.conteudo}>
                <Text style={Estilos.titulo}>Boas vindas novamente!</Text>

                <View style={Estilos.containerInput}>
                    <Fontisto name="email" size={24} color={Cores.icones} />
                    <TextInput
                        onChangeText={setEmail}
                        value={email}
                        placeholder={"Digite seu email"}
                        style={Estilos.textoInput}
                    />
                </View>

                <View style={Estilos.containerInput}>
                    <MaterialIcons name="lock-outline" size={24} color={Cores.icones} />
                    <TextInput
                        onChangeText={setSenha}
                        value={senha}
                        placeholder={"Digite a senha"}
                        style={Estilos.textoInput}
                    />
                    <Feather name="eye" size={24} color={Cores.icones} />
                </View>

                <TouchableOpacity onPress={() => navigation.navigate("MenuDrawer")}>
                    <LinearGradient
                        colors={['#2a0054', '#710090']} // Define as cores do gradiente
                        start={[0, 0]} // Posição inicial do gradiente
                        end={[1, 0]} // Posição final do gradiente
                        style={Estilos.botao}
                    >
                        <Text style={Estilos.textoBotao}>Entrar</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}