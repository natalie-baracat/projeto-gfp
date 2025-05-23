import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";
// import AppLoading from "expo-app-loading"; // ou use SplashScreen para apps mais avançados

import MenuDrawer from "./src/components/MenuDrawer";
import Login from "./src/pages/Login";
import CadContas from "./src/pages/CadContas";
import { Cores } from "./src/styles/Estilos";
import CadCategorias from "./src/pages/CadCategorias";



const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // }

  return (
    <NavigationContainer>
      <Stack.Navigator
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
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="MenuDrawer" component={MenuDrawer} options={{ headerShown: false }} />
        <Stack.Screen name="CadContas" component={CadContas} options={{ title: "Cadastro de Conta" }} />
        <Stack.Screen name="CadCategorias" component={CadCategorias} options={{ title: "Cadastro de Conta" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
