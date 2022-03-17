import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';  // Dispatch를 통해 Action을 함.
import { loginUser } from '../../../_actions/User_action';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router";

function LoginPage() {

const dispatch = useDispatch();
const navigate = useNavigate();
const { state } = useLocation();

const [Email, setEmail] = useState("")
const [Password, setPassword] = useState("")

useEffect(() => {

  setEmail(state)

}, [])


const onEmailHandler = (event) => {
  setEmail(event.currentTarget.value)
}
const onPasswordHandler = (event) => {
  setPassword(event.currentTarget.value)
}
const onSubmitHandler = (event) => {
  //  함수가 실행되기도 전에 refresh되는 것을 방지해줌.
  event.preventDefault();

  let body = {
    email: Email,
    password: Password
  }
  
  dispatch(loginUser(body))
    .then(response => {
      if (response.payload.loginSuccess) {
        navigate('/')   // page이동 V6
      } else {
        alert('Error')
      }
    })
}

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center'
      , width: '100%', height: '100%'
    }}>
      <form style={{ display: 'flex', flexDirection: 'column'}}
        onSubmit={onSubmitHandler}
      >
          <label>Email</label>
          <input type="email" value={Email} onChange={onEmailHandler} />
          <label>Password</label>
          <input type="password" value={Password} onChange={onPasswordHandler} />
          <br />
          <button>Login</button>
      </form>
    </div>
  )
}

export default LoginPage