import { View, Text, Button, TextInput } from "react-native"
import Estilos, { Cores } from "../styles/Estilos"


export default function Login({ navigation }) {
    return (
        <View style={Estilos.conteudo}>
            <Text style={Estilos.loginTitle}>Boas vindas novamente!</Text>

            <Text style={{color: "#fef"}}>Email</Text>
            <TextInput placeholder={"Digite seu email"} />


            <Text style={{color: "#fef"}}>Senha</Text>
            <TextInput placeholder={"Digite a senha"} />
            
            <Button title="Entrar" onPress={() => navigation.navigate("MenuDrawer")} />
        </View>
    )
}