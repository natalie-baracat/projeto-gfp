import { View, Text, Button, TextInput } from "react-native"
import Estilos from "../styles/Estilos"


export default function Login({ navigation }) {
    return (
        <View style={Estilos.conteudo}>
            <Text style={Estilos.loginTitle}>Boas vindas novamente!</Text>

            <Text></Text>
            <TextInput placeholder={"Digite seu nome"} />
            <Button title="Entrar" onPress={() => navigation.navigate("MenuDrawer")} />
        </View>
    )
}