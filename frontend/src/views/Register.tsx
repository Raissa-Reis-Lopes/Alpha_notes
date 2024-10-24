import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterPage from '../components/RegisterPage/RegisterPage';
import LoginContainer from '../components/LoginContainer/LoginContainer';
import { styled } from '@mui/material/styles';
import CustomInput from '../components/CustomInput/CustomInput';
import CustomButton from '../components/CustomButton/CustomButton';
import TextLink from '../components/TextLinks/TextLinks';
import Toast from '../components/Toast/Toast';

const Logo = styled('img')(({ theme }) => ({
  width: '10rem',
  marginBottom: '2rem',
}));

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState(''); // Cor do texto do Toast

  const emailInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // Função para mostrar o Toast com mensagem personalizada
  const showToast = (message: string, color: string = '#ff0000') => {
    setToastVisible(false); // Resetar a visibilidade do toast antes de mostrar
    setToastMessage(message);
    setToastColor(color);
    setTimeout(() => setToastVisible(true), 100); // Pequeno delay para garantir que o toast atualize
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!username) {
      showToast('O nome não pode estar vazio!'); // Exibe o Toast com erro
      return;
    }

    if (!email) {
      showToast('O email não pode estar vazio!');
      return;
    }

    if (!password) {
      showToast('A senha não pode estar vazia!');
      return;
    }

    const userData = { username, email, password };

    console.log(userData)

    try {
      const response = await fetch('https://alpha04.alphaedtech.org.br:3001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        navigate('/login');
      } else {
        const errorData = await response.json();
        console.error(errorData.error);
        showToast('Erro ao cadastrar: ' + errorData.error, '#ff6347');
      }
    } catch (error: any) {
      console.error('Erro ao fazer cadastro:', error);
      showToast(`Erro ao fazer cadastro! ${error.message}`, '#ff6347');
    }
  };

  return (
    <RegisterPage>
      <Logo src="/logo.svg" alt="Logo" />
      <LoginContainer height="25rem" width="30rem">
        <h2
          style={{
            color: '#06bb74',
            margin: '0px',
            marginBottom: '0.5rem',
            fontWeight: '600',
            fontSize: '1.5rem',
            textAlign: 'center',
            fontFamily: 'Fredoka, sans-serif',
          }}
        >
          Faça seu cadastro
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
        >
          <CustomInput
            type="text"
            placeholder="Nome de usuário"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setToastVisible(false); // Resetar o Toast ao mudar o valor
            }}
          />
          <CustomInput
            ref={emailInputRef}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setToastVisible(false); // Resetar o Toast ao mudar o valor
            }}
          />
          <CustomInput
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setToastVisible(false); // Resetar o Toast ao mudar o valor
            }}
          />
          <CustomButton type="submit" color="#00bf74" hoverColor="#009f64">
            Cadastrar
          </CustomButton>
        </form>
        <TextLink
          text="Já possui uma conta?"
          linkText="Faça login!"
          linkTo="/login"
          textColor="#371c44"
          linkColor="#00bf74"
        />
      </LoginContainer>

      {/* Componente de Toast para exibir as mensagens */}
      <Toast message={toastMessage} color={toastColor} isActive={toastVisible} />
    </RegisterPage>
  );
};

export default Register;
