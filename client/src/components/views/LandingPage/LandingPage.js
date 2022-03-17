import React,{ useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LandingPage() {

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/hello')
    .then(response => {
      console.log(response);
    })
  }, [])

  const onClickHandler = () => {
    axios.get(`/api/users/logout`)
    .then(response => {
      if(response.data.logoutSuccess) {
        navigate('/login')
      } else {
        alert('Failed logout')
      }
    })
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center'
      , width: '100%', height: '100%'
    }}>
      <h2>시작 페이지</h2>

      <button onClick={onClickHandler}>
        Logout
      </button>
    </div>
  )
}

export default LandingPage