import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UNSAFE_DataRouterStateContext, useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import { tokenContext } from "../App";

export default function TransactionsPage() {

  const [value, setValue] = useState("");
  const [desc, setDesc] = useState("");
  const [token] = useContext(tokenContext);
  const { tipo } = useParams();
  const navigate = useNavigate();
  
  useEffect( () => {
    if(tipo !== "entrada" && tipo !== "saida")  navigate("/home");
    if(!token) navigate("/")    
  }) 

  function formSubmit(e) {
    e.preventDefault(); 

    axios.post(`${import.meta.env.VITE_API_URL}/nova-transacao/${tipo}`, {registerLabel: desc, value: parseFloat(value.replace(",", "."))})
      .then(navigate("/home"))
      .catch( (reason) => {
        const status = reason.response.status;
        if(status === 422) alert("Formato invalido dos dados!");
        if(status === 401) {
          alert("Token invalido ou expirado!");
          navigate("/");
        }
      })
  } 

  return (
    <TransactionsContainer>
      <h1>Nova {tipo}</h1>
      <form onSubmit={formSubmit}>
        <input data-test="registry-amount-input" value={value} onChange={e => setValue(e.target.value)} placeholder="Valor" type="text"/>
        <input data-test="registry-name-input" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descrição" type="text"/>
        <button data-test="registry-save" type="submit">Salvar {tipo} </button>
      </form>
    </TransactionsContainer>
  )
}

const TransactionsContainer = styled.main`
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  h1 {
    align-self: flex-start;
    margin-bottom: 40px;
  }
`
