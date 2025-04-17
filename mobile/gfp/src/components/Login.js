import { View, Text, Button } from "react-native"

export default function Login({ navigation }) {
    return (
        <View>
            <Text>Login</Text>
            <Button title="Entrar" onPress={() => navigation.navigate("MenuDrawer")} />
        </View>
    )
}