import React, { useState } from 'react';
import { useDispatch } from 'react-redux';  // Dispatch를 통해 Action을 함.
import { registerUser } from '../../../_actions/User_action';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {

const dispatch = useDispatch();
const navigate = useNavigate();

const [Email, setEmail] = useState("")
const [Password, setPassword] = useState("")
const [Name, setName] = useState("")
const [ConfirmPassword, setConfirmPassword] = useState("")

const onEmailHandler = (event) => {
  setEmail(event.currentTarget.value)
}
const onNameHandler = (event) => {
  setName(event.currentTarget.value)
}
const onPasswordHandler = (event) => {
  setPassword(event.currentTarget.value)
}
const onConfirmPasswordHandler = (event) => {
  setConfirmPassword(event.currentTarget.value)
}
const onSubmitHandler = (event) => {
  //  함수가 실행되기도 전에 refresh되는 것을 방지해줌.
  event.preventDefault();

  if(Password !== ConfirmPassword) {
    return alert('비밀번호를 확인해주세요.')
  } 

  let body = {
    email: Email,
    name: Name,
    password: Password
  }
  
  dispatch(registerUser(body))
    .then(response => {
      if (response.payload.registerSuccess) {
        navigate('/login', {state:Email})   // page이동 V6
      } else {
        alert('Ereor')
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
          <label>Name</label>
          <input type="name" value={Name} onChange={onNameHandler} />
          <label>Password</label>
          <input type="password" value={Password} onChange={onPasswordHandler} />
          <label>Confirm Password</label>
          <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />
          <br />
          <button>Sign up</button>
      </form>
    </div>
  )
}

export default RegisterPage