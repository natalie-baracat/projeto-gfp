import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MenuDrawer from "./src/components/MenuDrawer";
import Login from "./src/pages/Login";


const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name="MenuDrawer" component={MenuDrawer} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}