import styled from "styled-components"
import { Link, useNavigate } from "react-router-dom"
import MyWalletLogo from "../components/MyWalletLogo"
import { useContext, useState } from "react";
import axios from "axios";
import { tokenContext } from "../App";

export default function SignInPage() {

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const navigator = useNavigate();
  const [token, setToken] = useContext(tokenContext);

  function submitForm(e)  {
    e.preventDefault();

    const promisse = axios.post(`${import.meta.env.VITE_API_URL}`, {email, password: pass})

      .then((response) => {
        const newToken = response.data;         
        localStorage.setItem("token", newToken);

        setToken(newToken);
        navigator("/home");
      })

      .catch((reason) => {
        const code = reason.response.status;
        if(code === 422) alert("Formato invalido dos inputs!");
        if(code === 404) alert("Email nao registrado!");
        if(code === 401) alert("Senha invalida!");
      })
  }


  return (
    <SingInContainer>
      <form onSubmit={submitForm}>
        <MyWalletLogo />
        <input placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email"/>
        <input placeholder="Senha" value={pass} onChange={(e) => setPass(e.target.value)} type="password" autoComplete="password" />
        <button type="submit">Entrar</button>
      </form>

      <Link to="/cadastro">
        Primeira vez? Cadastre-se!
      </Link>
    </SingInContainer>
  )
}

const SingInContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  a:hover {
    text-decoration: underline;
  }
`
