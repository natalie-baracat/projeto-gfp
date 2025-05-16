export const Cores = {
    principal: "#710090",
    secundaria: "#ffb20c",
    terciaria: "#293d80",
    fundo: "#1B1B1B",
    textos: "#FFFFF9",
    textosBaixaOp: "rgba(255, 255, 249, 0.74)",
    icones: "#FFFFF9"
};

const Estilos = {
    conteudo: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: Cores.fundo,
        padding: "24px",
        boxSizing: "border-box"
    },
    loginTitle: {
        textAlign: "center",
        fontSize: "30px",
        color: Cores.secundaria,
        marginBottom: "24px"
    },
    inputDados: {
        width: "100%",
        padding: "12px 16px",
        fontSize: "14px",
        marginBottom: "16px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        backgroundColor: "rgba(224, 167, 246, 0.08)",
        color: Cores.textos,
        outline: "none",
    },
    containerLembrarMostrar: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        alignItems: "center",
        marginBottom: "20px",
        fontSize: "14px",
        color: Cores.textosBaixaOp
    },
    btnEntrar: {
        background: "linear-gradient(0deg, rgba(42, 0, 84, 1) 5%, rgba(113, 0, 144, 1) 61%)",
        color: Cores.textos,
        padding: "14px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "16px",
        width: "100%"
    }
};

export default Estilos;
