import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterPage from '../components/RegisterPage/RegisterPage';
import LoginContainer from '../components/LoginContainer/LoginContainer';
import { styled } from '@mui/material/styles';
import CustomInput from '../components/CustomInput/CustomInput';
import CustomButton from '../components/CustomButton/CustomButton';
import TextLink from '../components/TextLinks/TextLinks';


const Logo = styled('img')(({ theme }) => ({
  width: '10rem',
  marginBottom: '2rem',
}));

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = { username, email, password };

    try {
      const response = await fetch('${process.env.REACT_APP_BACKEND_API_ADDRESS}/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        navigate('/login');
      } else {
        const errorData = await response.json();
        console.error(errorData.error);
      }
    } catch (error) {
      console.error('Erro ao fazer cadastro:', error);
    }
  };

  return (

    <RegisterPage>
      <Logo src="/logo.svg" alt="Logo" />
      <LoginContainer height="25rem" width='30rem'>
        <h2 style={{ color: '#06bb74', margin: '0px', marginBottom: '0.5rem', fontWeight: '600', fontSize: '1.5rem', textAlign: 'center', fontFamily: 'Fredoka, sans-serif' }}>Faça seu cadastro</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <CustomInput
            type="text"
            placeholder="Nome de usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <CustomInput
            ref={emailInputRef}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <CustomInput
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <CustomButton type="submit" color="#00bf74" hoverColor="#009f64">Cadastrar</CustomButton>
        </form>
        <TextLink
          text="Já possui uma conta?"
          linkText="Faça login!"
          linkTo="/login"
          textColor="#371c44"
          linkColor="#00bf74"
        />

      </LoginContainer>
    </RegisterPage>
  );
};

export default Register;
