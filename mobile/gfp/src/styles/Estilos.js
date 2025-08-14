// export const Cores = {
//     principal: "#710090",
//     secundaria: "#ffb20c",
//     fundo: "#1B1B1B",
//     textos: "#FFFFF9"
// }

// // import Cores from "./Cores"


// const Estilos = {
//     conteudo: {
//         flex: 1,
//         width: "100%",
//         backgroundColor: Cores.fundo
//     },
//     loginTitle: {
//         textAlign: "center",
//         fontSize: 30,
//         color: Cores.secundaria
//     },
//     btnEntrar: {
//         backgroundColor: Cores.principal
//     }
// }

// export default Estilos

export const Cores = {
    principal: "#710090",
    secundaria: "#ffb20c",
    terciaria: "#293d80",
    fundo: "#1B1B1B",
    textos: "#FFFFF9",
    textosBaixaOp:"rgba(255, 255, 249, 0.74)",
    icones:"#FFFFF9",
    branco: "#fff"

}

const Estilos = {
    /* LOGIN */
    conteudo: {
        flex: 1,
        width: "100%",
        padding: 24,
        justifyContent: "center",
    },
    background: {
        width: "100%",
      height: undefined,
      aspectRatio: 9 / 16,
      alignItems: "center",
      justifyContent: "center",
    },
    titulo: {
        fontSize: 20,
        color: Cores.textos,
        textAlign: "center",
        marginBottom: 32,
        fontWeight: "bold"
    },
    containerInput: {
        backgroundColor: "rgba(224, 167, 246, 0.08)",
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 13,
        color: Cores.textos,
        marginBottom: 16,
        display: "flex",
        flexDirection: "row",
        justifyContent: "spaceAround"
    },
    textoInput: {
        color: Cores.textos,
        border: "none !important",
        width: "100%",
        marginLeft: 12
    },
    btnEntrar: {
        backgroundColor: "linear-gradient(0deg,rgba(42, 0, 84, 1) 5%, rgba(113, 0, 144, 1) 61%)",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 8,
    },
    textoBotao: {
        color: Cores.textos,
        fontSize: 16,
        fontWeight: "bold"
    },
    containerLembrarMostrar: {
        flexDirection: "row",
        marginBottom: 20,
        justifyContent: "space-between"
    },

    /* TELA PRINCIPAL */
    conteudoHeader: {
        flex: 1,
        backgroundColor: Cores.principal
    },
    conteudoCorpo: {
        flex: 1,
        backgroundColor: Cores.branco,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 15
    },
    imagemLista: {
        width: 35,
        height: 35,
        marginRight: 10
    },
    itemLista: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingVertical: 7
    },
    textoListaContainer: {
        flex: 1
    },
    nomeLista: {
        fontSize: 16,
        fontWeight: "bold",
        // color: Cores.secundaria
    },
    corLista1: {
        color: Cores.secundaria
    },
    corLista2: {
        color: Cores.terciaria
    },
    // CADASTRO CONTAS
    inputCad: {
        marginTop: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        backgroundColor: "#fff"
    },
    modalFundo: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(27, 3, 51, 0.07)",
        backdropFilter: "blur(2px)"
    },
    modalConteudo: {
        backgroundColor: Cores.principal,
        padding: 16,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25
    },
    modalTitulo: {
        fontSize: 18,
        color: Cores.branco,
        marginBottom: 16
    },
    modalInput: {
        backgroundColor: Cores.branco,
        padding: 8,
        borderRadius: 8,
        flex: 1
    },
    modalBotoes: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 16
    },
    corBotao: {
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 8,
        borderWidth: 2,
        borderColor: Cores.branco
    },
    iconeBotao: {
        width: 40,
        height: 40,
        padding: 8,
        borderRadius: 20,
        backgroundColor: "#333",
        justifyContent: "center",
        alignItems: "center"
    },
    SeletorContainer: {
        backgroundColor: "#1e1e1e",
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16
    },
    listaModal: {
        flexDirection: "row",
        flexWrap: "wrap",

    }
}

export default Estilos
