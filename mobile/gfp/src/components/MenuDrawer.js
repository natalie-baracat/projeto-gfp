import { createDrawerNavigator } from "@react-navigation/drawer"
import Principal from "./Principal"
import { Cores } from "../styles/Estilos"
import Contas from "../pages/Contas"

const Drawer = createDrawerNavigator()

export default function MenuDrawer() {
    return (
        <Drawer.Navigator
            // estilizando a barra de navegação
            screenOptions={{
                headerStyle: {
                    backgroundColor: Cores.principal,
                    elevation: 0
                },
                headerTintColor: Cores.textos,
                sceneContainerStyle: {
                    backgroundColor: Cores.principal // ou a mesma cor do header
                }
            }}
        >
            <Drawer.Screen name="Principal" component={Principal}></Drawer.Screen>
            <Drawer.Screen name="Contas" component={Contas}></Drawer.Screen>
        </Drawer.Navigator>
    )
}