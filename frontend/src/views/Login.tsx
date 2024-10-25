import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginContainer from '../components/LoginContainer/LoginContainer';
import NoteBox from '../components/Note/NoteBox/NoteBox';
import { styled } from '@mui/material/styles';
import LoginPage from '../components/LoginPage/LoginPage';
import CustomInput from '../components/CustomInput/CustomInput';
import CustomButton from '../components/CustomButton/CustomButton';
import TextLink from '../components/TextLinks/TextLinks';
import { useUser } from '../contexts/UserContext';
import Toast from '../components/Toast/Toast';

const Logo = styled('img')(({ theme }) => ({
  width: '10rem',
  marginBottom: '2rem',
}));

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState(''); // Cor do texto do Toast

  const emailInputRef = useRef<HTMLInputElement>(null);
  const { setUser } = useUser();
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
    const userData = { email, password };

    if (!email) {
      showToast('O email não pode estar vazio!');
      return;
    }

    if (!password) {
      showToast('A senha não pode estar vazia!');
      return;
    }

    try {
      const response = await fetch('https://alpha04.alphaedtech.org.br:443/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });
      console.log("Chegou dentro do try do login")
      if (response.ok) {
        const data = await response.json();
        console.log("Logado com sucesso:", data);
        setUser(data.data);
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Erro ao fazer login.');
      }
    } catch (error) {
      showToast('Erro ao conectar ao servidor.');
    }
  };

  return (
    <LoginPage>
      <Logo src="/logo.svg" alt="Logo" />
      <LoginContainer>
        <NoteBox>
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
          >
            <CustomInput
              ref={emailInputRef}
              type="email"
              placeholder="E-mail"
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
              Entrar
            </CustomButton>
          </form>
          <TextLink
            text="Não possui uma conta?"
            linkText="Cadastre-se!"
            linkTo="/register"
            textColor="#371c44"
            linkColor="#00bf74"
          />
        </NoteBox>
      </LoginContainer>

      {/* Componente de Toast para exibir as mensagens */}
      <Toast message={toastMessage} color={toastColor} isActive={toastVisible} />
    </LoginPage>
  );
};

export default Login;