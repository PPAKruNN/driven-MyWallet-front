import { Link } from "react-router-dom"
import styled from "styled-components"
import MyWalletLogo from "../components/MyWalletLogo"
import { useState } from "react";
import axios from "axios";

export default function SignUpPage() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  
  function submitForm(e) {
    e.preventDefault();

    if(pass !== confirm) return alert("A senha e a confirmacao nao sao iguais!"); 

    const promisse = axios.post(`${import.meta.env.VITE_API_URL}/cadastro`, {name, email, password: pass})
      .then( (response) => {
          console.log("Cadastro realizado!"); // pretendo usar toast! 
      })
      
      .catch( (reason) => {
        const code = reason.response.status;
        if(code === 422) alert("Formato invalido dos inputs! \n" + reason.response.data.map(c => c));
        if(code === 409) alert("Email ja esta registrado!");
        if(code === 401) alert("Senha invalida!");
      })
  }

  return (
    <SignUpContainer>
      <form onSubmit={submitForm}>
        <MyWalletLogo />
        <input required={true} placeholder="Nome" type="text" value={name} onChange={e => setName(e.target.value)}/>
        <input required={true} placeholder="E-mail" type="email" value={email} onChange={e => setEmail(e.target.value)}/>
        <input required={true} placeholder="Senha" type="password" value={pass} onChange={e => setPass(e.target.value)}/>
        <input required={true} placeholder="Confirme a senha" type="password" value={confirm} onChange={e => setConfirm(e.target.value)}/>
        <button type="submit">Cadastrar</button>
      </form>

      <Link to="/">
        Já tem uma conta? Entre agora!
      </Link>
    </SignUpContainer>
  )
}

const SignUpContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  a:hover {
    text-decoration: underline;
  }
`
