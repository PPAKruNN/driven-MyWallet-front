import styled from "styled-components"
import { BiExit } from "react-icons/bi"
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"
dayjs.extend(utc);


export default function HomePage() {
  
  const [userData, setUserData] = useState({});
  const navigator = useNavigate();

  useEffect( () => {
   (async () => {
      try {
        const userProfile = await axios.get(`${import.meta.env.VITE_API_URL}/usuarioInfo`);
        const registers = await axios.get(`${import.meta.env.VITE_API_URL}/registros`);   

        const data = {...userProfile.data, registers: registers.data};
        setUserData(data); 

      } catch (reason) {
        if(reason.response.status === 500) alert("Erro desconhecido no servidor, tente novamente mais tarde!");
        if(reason.response.status === 401) alert("Token invalido ou expirado!")
        if(reason.response.status === 404) alert("Token invalido ou expirado!")
  
        localStorage.removeItem("token");
        navigator("/");  
      } 
    })() 
  }, []);

  function genRegisters() {

    if(!userData.registers) return (<h1>Loading</h1>)
    
    if(userData.registers.length === 0) return (<h1>Não há registros de entrada ou saída</h1>)

    return (
    <TransactionsContainer>
      <ul>
        {genList()}
      </ul>

      <article>
        <strong>Saldo</strong>
        {calcSaldo()}
      </article>
    </TransactionsContainer>
    )
  }

  function genList() {
    if(!userData.registers) return;
    return userData.registers.map( curr => 
      (
        <ListItemContainer id={curr.timestamp} key={curr.timestamp} >
          <div>
            <span>{dayjs.utc(curr.date).local().format("DD/MM")}</span>
            <strong>{curr.registerLabel}</strong>
          </div>
          <Value color={curr.type === "entrada" ? "entrada" : "saida" }>{curr.value.toFixed(2).toLocaleString("PT")}</Value>
        </ListItemContainer> 
      )
    )
  } 

  function calcSaldo(){
    if(!userData.registers) return 0;
    const saldo = userData.registers.reduce( (prev, curr) => {
      let val = curr.type === "entrada" ? 1 : -1
      return prev + (curr.value * val);
    }, 0)
    
    return (<Value color={saldo > 1 ? "entrada" : "saida"}>{saldo}</Value>);
  }

  return (
    <HomeContainer>
      <Header>
        <h1>Olá, {userData.name}</h1>
        <BiExit />
      </Header>

      <TransactionsContainer>
        {genRegisters()}
      </TransactionsContainer>


      <ButtonsContainer>
        <Link to="/nova-transacao/entrada">
          <AiOutlinePlusCircle />
          <p>Nova <br /> entrada</p>
        </Link>
        <Link to="/nova-transacao/saida">
          <AiOutlineMinusCircle />
          <p>Nova <br />saída</p>
        </Link>
      </ButtonsContainer>

    </HomeContainer>
  )
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
`
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 5px 2px;
  margin-bottom: 15px;
  font-size: 26px;
  color: white;
`
const TransactionsContainer = styled.article`
  flex-grow: 1;
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  h1 {
    color: #868686;
    font-size: 20px;
    font-weight: 400;
    text-align: center;
    margin: auto 20%;
  }

  article {
    display: flex;
    justify-content: space-between;   

    strong {
      font-weight: 400;
      font-size: 16px;
      font-family: 'Raleway', sans-serif;
      line-height: 19px;
    }
  }
`
const ButtonsContainer = styled.section`
  margin-top: 15px;
  margin-bottom: 0;
  display: flex;
  gap: 15px;
  
  a {
    width: 50%;
    height: 115px;
    font-size: 22px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #A328D6;
    padding: 10px;

    p {
      font-size: 18px;
    }
  }
`
const Value = styled.div`
  font-size: 16px;
  text-align: right;
  color: ${(props) => (props.color === "entrada" ? "green" : "red")};
`
const ListItemContainer = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #000000;
  margin-right: 10px;
  div span {
    color: #c6c6c6;
    margin-right: 10px;
  }
`