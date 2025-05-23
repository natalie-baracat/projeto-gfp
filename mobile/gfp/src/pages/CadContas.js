import React, { useState, useEffect, useLayoutEffect } from "react";

import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Estilos, { Cores } from "../styles/Estilos"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Switch } from "react-native-gesture-handler";

import { enderecoServidor } from "../utils"
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function CadContas({ navigation, route }) {
    const [inputNome, setInputNome] = useState("")
    const [inputTipo, setInputTipo] = useState("")
    const [inputSaldo, setInputSaldo] = useState("")
    const [inputContaPadrao, setInputContaPadrao] = useState("")
    const [usuario, setUsuario] = useState("")

    // para o botao de salvar na header
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={botaoSalvar}>
                    <MaterialIcons name="save" size={28} color={Cores.branco} style={{ marginRight: 8 }} />
                </TouchableOpacity>
            )
        })
    }, [navigation, inputNome, inputTipo, inputSaldo, inputContaPadrao]) //nao entendi pq dessas variaveis aqui mas ok

    const buscarUsuarioLogado = async () => {
        const usuarioLogado = await AsyncStorage.getItem("UsuarioLogado")
        if (usuarioLogado) { // se usuarioLogado NAO estiver vazio
            setUsuario(JSON.parse(usuarioLogado))
        } else {
            navigation.navigate("Login")
        }
    }

    useEffect(() => {
        buscarUsuarioLogado()
    }, [])

    useEffect(() => {
        if(route.params && route.params.Conta) {
            setInputNome(route.params.Conta.nome)
            setInputTipo(route.params.Conta.tipo_conta)
            setInputSaldo(route.params.Conta.saldo.toString())
            setInputContaPadrao(route.params.Conta.conta_padrao)
        } 
    }, [route.params])

    const botaoSalvar = async () => {
        try {
            // eu nao tenho conta_padrao no banco de dados. adicionar depois!!
            const dados = {
                nome: inputNome,
                tipo_conta: inputTipo,
                saldo: inputSaldo,
                conta_padrao: inputContaPadrao
            }

            let endpoint = `${enderecoServidor}/contas`
            let metodo = "POST"
            // se os dados já existirem, o sistema detecta que queremos EDITAR a conta e muda o metodo para PATCH
            if(route.params && route.params.Conta) {
                endpoint = `${enderecoServidor}/contas/${route.params.Conta.id_conta}`
                metodo = "PATCH"
            }

            const resposta = await fetch(endpoint, {
                method: metodo,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${usuario.token}`
                },
                body: JSON.stringify(dados)

            })

            if (resposta.ok) {
                alert("Conta cadastrada com sucesso")
                navigation.goBack()
            }

        } catch (error) {
            console.error("Erro ao salvar:", error)
        }
    }

    return (
        <View style={Estilos.conteudoHeader}>
            <View style={Estilos.conteudoCorpo}>

                <Text>Tipo da conta:</Text>
                <TextInput
                    placeholder="Digite o tipo da conta"
                    value={inputTipo}
                    style={Estilos.inputCad}
                    onChangeText={setInputTipo}
                />

                <Text>Nome da conta:</Text>
                <TextInput
                    placeholder="Digite o nome da conta"
                    value={inputNome}
                    style={Estilos.inputCad}
                    onChangeText={setInputNome}
                />

                <Text>Saldo:</Text>
                <TextInput
                    placeholder="Digite o Saldo"
                    value={inputSaldo}
                    style={Estilos.inputCad}
                    onChangeText={setInputSaldo}
                    keyboardType="numbers-and-punctuation"
                />

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Switch
                        value={inputContaPadrao}
                        onValueChange={setInputContaPadrao}
                        style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                    />
                    <Text>Conta Padrão</Text>
                </View>
            </View>
        </View>
    )
}