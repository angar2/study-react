import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import Auth from './hoc/auth';

function App() {

  // Route-element에는 element만 들어갈 수 있기에, method인 'Auth'를 element로 변환하는 과정이 필요함.
  const AuthLandingPage = Auth(LandingPage, null);
  const AuthLoginPage = Auth(LoginPage, false);
  const AuthRegisterPage = Auth(RegisterPage, false);

  return (
      <div>
        <Routes>
          <Route path="/*" element={<AuthLandingPage />}/>
          <Route path="/login" element={<AuthLoginPage />}/>
          <Route path="/register" element={<AuthRegisterPage />}/>
        </Routes>
      </div>
  );
}

export default App;