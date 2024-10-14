import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginContainer from '../components/LoginContainer/LoginContainer';
import NoteBox from '../components/NoteBox/NoteBox';
import { styled } from '@mui/material/styles';
import LoginPage from '../components/LoginPage/LoginPage';
import CustomInput from '../components/CustomInput/CustomInput';
import CustomButton from '../components/CustomButton/CustomButton';
import TextLink from '../components/TextLinks/TextLinks'; 

const Logo = styled('img')(({ theme }) => ({
  width: '10rem',
  marginBottom: '2rem',
}));

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = { email, password };

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        navigate('/home');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Erro ao fazer login.');
      }
    } catch (error) {
      setErrorMessage('Erro ao conectar ao servidor.');
    }
  };

  return (
    <LoginPage>
      <Logo src="/logo.svg" alt="Logo" />
      <LoginContainer>
        <NoteBox>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <CustomInput
              ref={emailInputRef}
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <CustomInput
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <CustomButton type="submit" color="#00bf74" hoverColor="#009f64">Entrar</CustomButton>
          </form>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <TextLink
            text="Não possui uma conta?"
            linkText="Cadastre-se!"
            linkTo="/register"
            textColor="#371c44"
            linkColor="#00bf74"
          />

        </NoteBox>
      </LoginContainer>
    </LoginPage>
  );
};

export default Login;
