import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UNSAFE_DataRouterStateContext, useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import { tokenContext } from "../App";

export default function EditRegisterPage() {

  const [value, setValue] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [token] = useContext(tokenContext);
  const { tipo, id } = useParams();
  const navigate = useNavigate();
  
  useEffect( () => {
    if(tipo !== "entrada" && tipo !== "saida")  navigate("/home");
    if(!token) navigate("/")

    axios.get(`${import.meta.env.VITE_API_URL}/registros`)
      .then( (response) => {
        const arr = response.data;
        const index = arr.findIndex( reg => reg.timestamp === parseInt(id) );
        setValue( arr[index].value.toString().replace(".", ",") );
        setDesc(arr[index].registerLabel);
        setDate(arr[index].date);
      })

      .catch( reason => {
        const status = reason.response.status;
        if(status === 422) alert("Formato invalido dos dados!");
        if(status === 401) {
          alert("Token invalido ou expirado!");
          navigate("/");
        }
      })
    
  },[]) 

  function formSubmit(e) {
    e.preventDefault(); 

    axios.put(`${import.meta.env.VITE_API_URL}/registros`, {date: date, registerLabel: desc, value: parseFloat(value.replace(",", ".")), timestamp: parseInt(id), tipo}, { headers: {timestamp: id}})
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
      <h1>Editar {tipo}</h1>
      <form onSubmit={formSubmit}>
        <input required={true} data-test="registry-amount-input" value={value} onChange={e => setValue(e.target.value)} placeholder="Valor" type="text"/>
        <input required={true} data-test="registry-name-input" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descrição" type="text"/>
        <button data-test="registry-save" type="submit">Atualizar {tipo} </button>
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
