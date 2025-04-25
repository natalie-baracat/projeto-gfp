export const Cores = {
    principal: "#710090",
    secundaria: "#ffb20c",
    fundo: "#1B1B1B",
    textos: "#FFFFF9",
    icones:"rgba(240, 238, 223, 0.79)"
}

const Estilos = {
    container: {
        minHeight: '100vh',
        backgroundColor: Cores.fundo,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        color: Cores.textos,
        fontFamily: 'sans-serif',
    },
    card: {
        backgroundColor: '#2A2A2A',
        padding: '2rem',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 0 12px rgba(0,0,0,0.4)',
    },
    titulo: {
        fontSize: '2rem',
        marginBottom: '1.5rem',
        color: Cores.textos,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        padding: '0.75rem 1rem',
        marginBottom: '1rem',
        borderRadius: '8px',
        border: '1px solid #444',
        backgroundColor: '#1f1f1f',
        color: Cores.textos,
        fontSize: '1rem',
        outline: 'none',
        transition: 'border 0.2s ease',
    },
    inputFocus: {
        borderColor: Cores.principal,
    },
    botao: {
        width: '100%',
        backgroundColor: Cores.principal,
        color: Cores.textos,
        padding: '0.75rem',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        cursor: 'pointer',
        marginTop: '0.5rem',
        fontWeight: 'bold',
    }
};
