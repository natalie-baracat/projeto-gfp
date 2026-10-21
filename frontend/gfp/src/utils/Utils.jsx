import { MdAccountBalance, MdAttachMoney, MdAutoGraph, MdBeachAccess, MdCreditCard, MdEmail, MdFeaturedPlayList } from "react-icons/md";
import { FaHouseChimney, FaKitMedical, FaTruckPlane, FaUtensils, FaMoneyBillWave, FaPaw, FaPersonSwimming, FaVolleyball, FaCartShopping, FaSeedling, FaScrewdriverWrench, FaDumbbell, FaHouse } from "react-icons/fa6";
import { FaGraduationCap, FaLaptopHouse } from "react-icons/fa";

// endereço do servidor da API, alterar conforme necessário
// export const enderecoServidor = "http://192.168.0.237:3000"
export const enderecoServidor = "http://localhost:3000"

// cores do prof
// export const listaCores = ["#FF5733", "#FFC300", "#DAF7A6", "#33FF57", "#33A1FF", "#8D33FF", "#FF33EC", "#FF33A1", "#33FFF6", "#FF7F50"];

export const listaCores = ["#bf0b0b","#ff5733","#ffb20c", "#70db32", "#358c2d", "#5adbd7", "#52a7d9", "#1a1c5c", "#a312c4", "#fa98c9"];

// export const listaIcones = ["restaurant", "directions-car", "school", "home", "sports-soccer", "shopping-cart", "pets", "favorite", "fitness-center", "wallet"];

// lista icones cadastrados no MOBILE
export const listaIcones = ["utensils", "house-chimney", "money-bill-transfer", "graduation-cap", "house", "volleyball", "cart-shopping", "paw", "kit-medical", "truck-plane", "person-skating", "house-laptop", "seedling", "wrench", "dumbbell, beach-acess"];

//i adapta os icones mobile para FRONTEND
export const iconesCategoria = {
    "utensils": <FaUtensils className="w-6 h-6" />,
    "house-chimney": <FaHouseChimney className="w-6 h-6" />,
    "graduation-cap": <FaGraduationCap className="w-6 h-6" />,
    "money-bill-transfer": <FaMoneyBillWave className="w-6 h-6" />,
    "kit-medical": <FaKitMedical className="w-6 h-6" />,
    "truck-plane": <FaTruckPlane className="w-6 h-6" />,
    "beach-access": <MdBeachAccess className="w-6 h-6" />,
    "house": <FaHouse className="w-6 h-6"/>,
    "volleyball": <FaVolleyball className="w-6 h-6"/>,
    "cart-shopping": <FaCartShopping className="w-6 h-6"/>,
    "paw": <FaPaw className="w-6 h-6"/>,
    "person-skating": <FaPersonSwimming className="w-6 h-6"/>,
    "house-laptop": <FaLaptopHouse className="w-6 h-6"/>,
    "seedling": <FaSeedling className="w-6 h-6"/>,
    "wrench": <FaScrewdriverWrench className="w-6 h-6"/>,
    "dumbbell": <FaDumbbell className="w-6 h-6"/>
}

export const tipoTransacao = {
    "SAIDA": true,
    "ENTRADA": false
}

export const iconesTipoConta = {
    "CONTA_CORRENTE": <MdAccountBalance className="w-6 h-6"/>,
    "POUPANCA": <MdEmail className="w-6 h-6"/>,
    "CARTAO_CREDITO": <MdCreditCard className="w-6 h-6"/>,
    "CARTAO_DEBITO": <MdFeaturedPlayList className="w-6 h-6"/>,
    "DINHEIRO": <MdAttachMoney className="w-6 h-6"/>,
    "INVESTIMENTO": <MdAutoGraph className="w-6 h-6"/>,
    }
    
export const nomesTipoConta = {
    "CONTA_CORRENTE": "Conta Corrente",
    "POUPANCA": "Poupança",
    "CARTAO_CREDITO": "Cartão de crédito",
    "CARTAO_DEBITO": "Cartão de Débito",
    "DINHEIRO": "Dinheiro",
    "INVESTIMENTO": "Investimento",
}

export const calcularDatasPeriodo = (periodo) => {
    const hoje = new Date()
    let dataInicio = new Date()
    let dataFim = new Date()

    switch (periodo) {
        case "esteMes":
            dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
            dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0) // pega o dia "zero" do proximo mes, ou seja, o ultimo dia do mes atual
            break;
        case "mesPassado":
            dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1)
            dataFim = new Date(hoje.getFullYear(), hoje.getMonth(), 0)
            break;
        case "ultimos7":
            dataInicio = setDate(hoje.getDate() - 6)
            dataFim = hoje
            break;
        case "ultimos30":
            dataInicio = setDate(hoje.getDate() - 29)
            dataFim = hoje
            break;
        case "todos":
            dataInicio = new Date(2000, 1, 1)
            dataFim = new Date(2100, 12, 31)
            break;
    }

    dataInicio = dataInicio.toISOString().split("T")[0]
    dataFim = dataFim.toISOString().split("T")[0]

    return { dataInicio, dataFim }
}

export const formatarDinheiro = (valor) => {
    valor = Number(valor)
    return valor.toLocaleString("pt-br", {style: "currency", currency: "BRL"})
    
}

export const formatarData = (data) => {
    const dataFormatada = new Date(data);
    return dataFormatada.toLocaleDateString("pt-BR", {day: "2-digit", month: "2-digit", year: "2-digit"})
}