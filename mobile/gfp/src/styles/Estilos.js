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
    icones:"rgba(240, 238, 223, 0.79)"

}

const Estilos = {
    conteudo: {
        flex: 1,
        width: "100%",
        padding: 24,
        justifyContent: 'center',
    },
    background: {
        width: '100%',
      height: undefined,
      aspectRatio: 9 / 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titulo: {
        fontSize: 20,
        color: Cores.textos,
        textAlign: 'center',
        marginBottom: 32,
        fontWeight: 'bold'
    },
    containerInput: {
        backgroundColor: "rgba(223, 167, 246, 0.13)",
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 13,
        color: Cores.textos,
        marginBottom: 16,
        display: "flex",
        flexDirection: "row"

    },
    botao: {
        backgroundColor: "linear-gradient(0deg,rgba(42, 0, 84, 1) 5%, rgba(113, 0, 144, 1) 61%)",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    textoBotao: {
        color: Cores.textos,
        fontSize: 16,
        fontWeight: 'bold'
    },
    textoInput: {
        color: Cores.textos,
        border: "none !important",
        width: "70%"
    }
}

export default Estilos
