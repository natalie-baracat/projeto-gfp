import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Principal from "./pages/Principal.jsx"
import Login from "./pages/Login.jsx"
import { UsuarioProvider } from "./UsuarioContext.jsx"


export default function App() {
  return (
    <UsuarioProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Principal />} />
        </Routes>
      </Router>
    </UsuarioProvider>
  )
}