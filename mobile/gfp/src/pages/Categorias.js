import React, { useState, useEffect, useLayoutEffect } from "react"
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Modal, TextInput, Button } from "react-native"

import Estilos, { Cores } from "../styles/Estilos"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import AsyncStorage from "@react-native-async-storage/async-storage"
import { enderecoServidor, listaCores, listaIcones } from "../utils"

export default function Categorias({ navigation }) {
    const [dadosLista, setDadosLista] = useState([])
    const [usuario, setUsuario] = useState({}) //dados do usuario logado
    const [atualizando, setAtualizando] = useState(false)

    const [modalVisible, setModalVisible] = useState(false)
    const [nomeCategoria, setNomeCategoria] = useState("")
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null)

    const [cor, setCor] = useState(Cores.secundaria)
    const [icone, setIcone] = useState("wallet")
    const [corModalVisible, setCorModalVisible] = useState(null)
    const [iconeModalVisible, setIconeModalVisible] = useState(null)

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

    const exibirItensLista = ({ item }) => {
        return (
            <TouchableOpacity style={Estilos.itemLista}>
                {/* ALTERAR PRA IMAGEM E FUNDO DO BD DEPOIS!!! 
                
                colocar uma view com background color: cor do banco de dados
                e uma imagem dentro com o icone do banco de dados  */}

                <View style={{ padding: 8, borderRadius: 20, marginRight: 8, backgroundColor: `${item.cor}` }}>
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
                    onPress={() => botaoEditar(item)}
                />

                <MaterialIcons
                    name="delete"
                    size={24}
                    color={Cores.terciaria}
                    onPress={() => botaoExcluir(item.id_categoria)}
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

            if (!confirm("Tem certeza que deseja excluir?")) return;

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
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <MaterialIcons name="add" size={28} color={Cores.branco} style={{ marginRight: 8 }} />
                </TouchableOpacity>
            )
        })
    }, [navigation])

    const botaoSalvar = async () => {
        try {
            const dados = {
                nome: nomeCategoria, // esse "nome", nao é o nome no BD. é o nome da variavel recebendo a req.body nas rotas. e nomeCategoria é a variavel usestate que recebe o valor
                tipo_transacao: "SAIDA",// fixo por enquanto
                id_usuario: usuario.id_usuario, // pegando os dados do usuario logado
                icone: icone,
                cor: cor
            }

            let endpoint = `${enderecoServidor}/categorias/new`
            let metodo = "POST"

            if (categoriaSelecionada) {
                endpoint = `${enderecoServidor}/categorias/editar/${categoriaSelecionada.id_categoria}`
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
                alert("Categoria salva com sucesso!")
                setModalVisible(false)
                setNomeCategoria("")
                setCategoriaSelecionada(null)
                buscarDadosAPI() //para atualizar a lista
            }

        } catch (error) {
            alert("erro ao salvar: " + error)
            console.error("erro ao salvar: ", error)
        }
    }

    const botaoEditar = (item) => {
        setCategoriaSelecionada(item)
        setNomeCategoria(item.nome)
        setCor(item.cor)
        setIcone(item.icone)
        setModalVisible(true)
    }
    const botaoCancelar = () => {
        setCategoriaSelecionada(null)
        setNomeCategoria("")
        setModalVisible(false)
    }

    // O QUE SERA EXIBIDO NA TELA
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

            {/* TELA QUE ABRE PARA ADD OU EDITAR A CATEGORIA */}
            <Modal visible={modalVisible} transparent={true} animationType="fade" onRequestClose={() => setModalVisible(false)}>
                <View style={Estilos.modalFundo}>
                    <View style={Estilos.modalConteudo}>

                        <Text style={Estilos.modalTitulo}>Categoria</Text>

                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <TextInput style={Estilos.modalInput}
                                placeholder="Nome da categoria"
                                placeholderTextColor={"#aaa"}
                                value={nomeCategoria}
                                onChangeText={setNomeCategoria}
                            />

                            {/* bolinha pra escolher cor */}
                            <TouchableOpacity style={[Estilos.corBotao, { backgroundColor: cor }]} onPress={() => setCorModalVisible(true)} />
                            {/* escolher icone */}
                            <TouchableOpacity style={Estilos.iconeBotao} onPress={() => setIconeModalVisible(true)}>
                                <FontAwesome6 name={icone} size={17} color="#FFF"/>
                            </TouchableOpacity>
                        </View>

                        <View style={Estilos.modalBotoes}>
                            <Button title="Cancelar" onPress={botaoCancelar} />
                            <Button title="Salvar" onPress={botaoSalvar} />

                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal de seleção de cor */}
            <Modal
                visible={corModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setCorModalVisible(false)}>
                <View style={Estilos.modalFundo}>
                    <View style={Estilos.SeletorContainer}>
                        <Text style={Estilos.modalTitulo}>Escolha uma cor</Text>
                        <View style={Estilos.listaModal}>
                            {listaCores.map((corItem) => (
                                <TouchableOpacity
                                    key={corItem}
                                    style={[Estilos.corBotao, { backgroundColor: corItem }]}
                                    onPress={() => {
                                        setCor(corItem);
                                        setCorModalVisible(false);
                                    }}
                                />
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal de seleção de ícone */}
            <Modal
                visible={iconeModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIconeModalVisible(false)}>

                <View style={Estilos.modalFundo}>
                    <View style={Estilos.SeletorContainer}>
                        <Text style={Estilos.modalTitulo}>Escolha um ícone</Text>
                        <View style={Estilos.listaModal}>
                            {listaIcones.map((iconeItem) => (
                                <TouchableOpacity
                                    key={iconeItem}
                                    style={[Estilos.iconeBotao, {margin: 3}]}
                                    onPress={() => {
                                        setIcone(iconeItem);
                                        setIconeModalVisible(false);
                                    }}>
                                    <FontAwesome6 name={iconeItem} size={17} color="#FFF" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    )
}