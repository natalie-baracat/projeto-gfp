// importando os componenets que vamos utilizar
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    Switch
} from "react-native"

import Estilos, { Cores } from "../styles/Estilos"
import { enderecoServidor } from "../utils"
import React, { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from "expo-linear-gradient"


export default function Login({ navigation }) {

    const [email, setEmail] = useState("douglas.camata@gmail.com")
    const [senha, setSenha] = useState("123")
    const [mostraSenha, setMostraSenha] = useState(false)
    const [isActive, setIsActive] = useState(false)
    const [lembrar, setLembrar] = useState(false)

    useEffect(() => {
        const buscarUsuarioLogado = async () => {
            const usuarioLogado = await AsyncStorage.getItem("UsuarioLogado")
            if (usuarioLogado) {
                const usuario = JSON.parse(usuarioLogado)
                if (usuario.lembrar == true) {
                    navigation.navigate("MenuDrawer")
                }
            }
        }

        buscarUsuarioLogado()
    }, [])

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
                AsyncStorage.setItem("UsuarioLogado", JSON.stringify({ ...dados, lembrar }))
                navigation.navigate("MenuDrawer")
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

    const { width, height } = Dimensions.get('window'); // só deus (e o chat) sabem como demorou pra descobrir esse metodo do dimensions (que foi o que mais deu certo)

    return (
        <ImageBackground
            source={require("../assets/fundocelular.png")}
            style={{ width: width, height: height }}
            resizeMode="cover"
        >
            <View style={Estilos.conteudo}>
                <Text style={Estilos.titulo}>Boas vindas novamente!</Text>

                <View style={Estilos.containerInput}>
                    <Fontisto name="email" size={18} color={Cores.icones} />

                    <TextInput
                        onChangeText={setEmail}
                        value={email}
                        placeholder={"Digite seu email"}
                        style={Estilos.textoInput}
                    />
                </View>

                <View style={Estilos.containerInput}>
                    <MaterialIcons name="lock-outline" size={18} color={Cores.icones} />

                    <TextInput
                        onChangeText={setSenha}
                        value={senha}
                        placeholder={"Digite a senha"}
                        style={Estilos.textoInput}
                    />
                    <TouchableOpacity onPress={() => setMostraSenha(!mostraSenha)}>
                        <Feather name={mostraSenha ? "eye-off" : "eye"} size={18} color={Cores.icones} />
                    </TouchableOpacity>

                </View>

                <View style={Estilos.containerLembrarMostrar}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>

                        <Switch
                            value={lembrar}
                            onValueChange={setLembrar}
                            style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                        />

                        <Text style={
                            {
                                color: Cores.textosBaixaOp,
                                fontSize: "80%",
                                marginLeft: 8
                            }
                        }>Lembre-se de mim</Text>

                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <TouchableOpacity>
                            <Text style={
                                {
                                    color: Cores.secundaria,
                                    fontSize: "80%",
                                }
                            }>Esqueceu a senha?</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity onPress={botaoEntrar}>
                    <LinearGradient
                        colors={['#2a0054', '#710090']} // Define as cores do gradiente
                        start={[0, 0]} // Posição inicial do gradiente
                        end={[1, 0]} // Posição final do gradiente
                        style={Estilos.btnEntrar}
                    >
                        <Text style={Estilos.textoBotao}>Entrar</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}