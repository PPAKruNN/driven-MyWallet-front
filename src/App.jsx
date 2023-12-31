import { BrowserRouter, Routes, Route } from "react-router-dom"
import styled from "styled-components"
import HomePage from "./pages/HomePage"
import SignInPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"
import TransactionsPage from "./pages/TransactionPage"
import { createContext, useState } from "react"
import axios from "axios"
import EditRegisterPage from "./pages/EditRegisterPage"

const tokenContext = createContext();
export { tokenContext };

export default function App() {

  const localToken = localStorage.getItem("token");
  const [token, setToken] = useState(localToken)
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  return (
    <tokenContext.Provider value={[token, setToken]}>
      <PagesContainer>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignInPage />} />
          <Route path="/cadastro" element={<SignUpPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/nova-transacao/:tipo" element={<TransactionsPage />} />
          <Route path="/editar-registro/:tipo/:id" element={<EditRegisterPage />} />
        </Routes>
      </BrowserRouter>
    </PagesContainer>
    </tokenContext.Provider>
  )
}

const PagesContainer = styled.main`
  background-color: #8c11be;
  width: calc(100vw - 50px);
  max-height: 100vh;
  padding: 25px;
`
