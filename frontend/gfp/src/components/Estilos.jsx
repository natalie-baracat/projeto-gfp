export const Cores = {
    principal: "#710090",
    secundaria: "#ffb20c",
    fundo: "#1B1B1B",
    textos: "#FFFFF9"
}

const Estilos = {
    conteudo: {
        flex: 1,
        margin: 0,
        width: "30%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: Cores.fundo,
        marginTop: "100px"
    },
    loginTitle: {
        textAlign: "center",
        fontSize: "30px",
        marginBottom: "10px",
        marginTop: "10px",
        color: Cores.secundaria
    },
    btnEntrar: {
        backgroundColor: Cores.principal
    },
    inputDados: {
        padding: "5px 8px",
        marginBottom: "10px",
        border: "none !important",
        borderBottom: "2px !important",
        borderStyle: "solid",
        borderColor: Cores.principal
    }
}

export default Estilos