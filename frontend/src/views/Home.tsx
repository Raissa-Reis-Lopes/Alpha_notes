import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomePage from '../components/HomePage/HomePage';
import SmileFace from '../components/SmileFace/SmileFace';
import { styled } from '@mui/material/styles';
import NoteInput from '../components/NoteInputHome/NoteInputHome';
import TextLink from '../components/TextLinks/TextLinks';
import CustomButton from '../components/CustomButton/CustomButton';
import HomeContainer from '../components/HomeContainer/HomeContainer';

const Logo = styled('img')(({ theme }) => ({
  width: '10rem',
  marginBottom: '2rem',
}));

const Home: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <HomePage>
      <Logo src="/logo.svg" alt="Logo" />
      <HomeContainer>
        <SmileFace src="/smile2.svg" alt="Smile1" size="5rem" top="5rem" left="15rem" />
        <SmileFace src="/smile.svg" alt="Smile2" size="7rem" top="15rem" left="5rem" />
        <SmileFace src="/smile2.svg" alt="Smile3" size="6rem" top="30rem" left="25rem" />
        <SmileFace src="/smile.svg" alt="Smile4" size="4rem" top="35rem" left="10rem" />

        <SmileFace src="/smile2.svg" alt="Smile1" size="5rem" top="5rem" left="75rem" />
        <SmileFace src="/smile.svg" alt="Smile2" size="7rem" top="15rem" left="85rem" />
        <SmileFace src="/smile2.svg" alt="Smile3" size="6rem" top="30rem" left="65rem" />
        <SmileFace src="/smile.svg" alt="Smile4" size="4rem" top="35rem" left="80rem" />

        <NoteInput
          placeholder="Organize suas ideias com apenas um clique"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ marginBottom: '1rem' }}
        />
        <CustomButton 
          type="button" 
          color="#00bf74" 
          hoverColor="#009f64" 
          width='15rem'
          onClick={handleRegisterClick}
        >
          Quero me cadastrar
        </CustomButton>
        <TextLink
          text="Já possui uma conta?"
          linkText="Faça login!"
          linkTo="/login"
          textColor="#371c44"
          linkColor="#00bf74"
        />
      </HomeContainer>
    </HomePage>
  );
};

export default Home;
