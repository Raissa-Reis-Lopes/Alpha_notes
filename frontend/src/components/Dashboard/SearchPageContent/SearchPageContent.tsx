import './SearchPageContent.css';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Box, ImageListItem, useMediaQuery, useTheme } from '@mui/material';
import { useUser } from '../../../contexts/UserContext';
import NoteInput from '../../Note/NoteInput/NoteInput';
import NoteCardList from '../../Note/NoteCard/NoteCardList';
import { useNotes } from '../../../contexts/NotesContext';
import { Card, CssBaseline, Typography } from '@mui/joy';
import { Image, AccountCircle } from '@mui/icons-material';

interface SearchPageContentProps {
  drawerOpen: boolean;
  drawerWidth: number;
  miniDrawerWidth: number;
  appBarHeight: number
  miniAppBarHeight: number;
}

const SearchPageContent: React.FC<SearchPageContentProps> = ({ drawerOpen, drawerWidth, miniDrawerWidth, appBarHeight, miniAppBarHeight }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const currentAppBarHeight = isMobile ? miniAppBarHeight : appBarHeight;
  const calculatedMarginLeft = drawerOpen ? drawerWidth : miniDrawerWidth;

  const { user } = useUser();
  const { searchedNotes, queryString } = useNotes();

  /* useEffect(() => {
    if (!user) return;

    (async function fetchNotes() {
      try {
        const notes = await getAllNotes();
      } catch (error) {
        console.error('Erro ao buscar notas:', error);
      }
    }());
  }, [user]); */


  /*   const [displayedText, setDisplayedText] = useState<string>(''); // Estado para armazenar o texto a ser exibido
    const [text, setText] = useState<string>(''); // Estado para armazenar o texto a ser exibido
    const typingSpeed = 50; // Defina a velocidade do efeito de digitação
  
    useEffect(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText((prev) => prev + text.charAt(index)); // Garantir que só os caracteres válidos sejam concatenados
          index++;
        } else {
          clearInterval(interval); // Para o intervalo quando todo o texto foi exibido
        }
      }, typingSpeed);
      setText('');
      return () => clearInterval(interval); // Limpa o intervalo quando o componente é desmontado
    }, [text]); */


  /* const texts = [
    'Faça buscas mais elaboradas com ajuda da IA!',
    'Ative-a na barra de pesquisa e pergunte sobre o assunto que desejas encontrar.',
  ]; */
  const [texts, setTexts] = useState<string[]>(['', '']);

  const speed = 12;

  const [currentTextIndex, setCurrentTextIndex] = useState(0); // Controla o índice do texto atual
  const [charIndex, setCharIndex] = useState(0); // Controla o índice de caracteres do texto
  const [displayText, setDisplayText] = useState(''); // Texto 1 sendo exibido
  const [displayText2, setDisplayText2] = useState(''); // Texto 2 sendo exibido

  useEffect(() => {
    if (charIndex < texts[0].length) {
      // Primeiro texto
      const timeoutId = setTimeout(() => {
        setDisplayText((prev) => prev + texts[0][charIndex]);
        setCharIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeoutId);
    } else if (charIndex >= texts[0].length && charIndex - texts[0].length < texts[1].length) {
      // Segundo texto
      const secondCharIndex = charIndex - texts[0].length;
      const timeoutId = setTimeout(() => {
        setDisplayText2((prev) => prev + texts[1][secondCharIndex]);
        setCharIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeoutId);
    }
  }, [charIndex, texts, speed]);

  useEffect(() => {

    setTimeout(() => {
      setTexts([
        'Faça buscas mais elaboradas com ajuda da IA!',
        'Ative-a na barra de pesquisa e pergunte sobre o assunto que desejas encontrar.',
      ]);
    }, 500);

  }, []);

  // Reinicia a digitação quando os textos mudam
  useEffect(() => {
    setCharIndex(0);
    setDisplayText('');
    setDisplayText2('');
  }, [texts]);

  /* const switchTexts = () => {
    setTexts([
      'Este é um novo primeiro texto!',
      'Este é um novo segundo texto!',
    ]);
  }; */



  useEffect(() => {
    setTexts([queryString, '']);
  }, [queryString]);

  /*  useEffect(() => {
     setText('Faça buscas mais elaboradas com ajuda da IA. Ative-a na barra de pesquisa e pergunte por qualquer coisa que você se lembra sobre o assunto desejado.');
     textRef.current = 'Faça buscas mais elaboradas com ajuda da IA. Ative-a na barra de pesquisa e pergunte por qualquer coisa que você se lembra sobre o assunto desejado.';
     setIndex(0);
     indexRef.current = 0;
   }, []) */

  /* let text = 'Faça buscas mais elaboradas com ajuda da IA!';
  let text2 = 'Ative-a na barra de pesquisa e pergunte por qualquer coisa que você se lembra sobre o assunto desejado.';
  let speed = 50;
  const [index, setIndex] = useState(0);
  const [index2, setIndex2] = useState(0);
  const displayText = useMemo(() => text.slice(0, index), [index]);
  const displayText2 = useMemo(() => text2.slice(0, index2), [index2]);
  useEffect(() => {
    if (index >= text.length) {
      if (index2 >= text2.length)
        return;

      const timeoutId2 = setTimeout(() => {
        setIndex2(i => i + 1);
        setIndex(i => i - 1);
      }, speed);

      return () => {
        clearTimeout(timeoutId2);
      };
    }
    const timeoutId = setTimeout(() => {
      setIndex(i => i + 1);
    }, speed);

    return () => {
      clearTimeout(timeoutId);
    };


  }, [index, text, speed, text2]); */

  /* return displayText; */











  const imageStyle = {
    width: '40px',
  };

  const imageStyle2 = {
    width: '40px',
    height: '40px',
    backgroundColor: 'white',
    borderRadius: '50%',
    padding: '4px 4px',
    boxShadow: '1px 4px 4px #939393',

  };






  /* setTimeout(() => {
    setText('   Olá, eu sou o Alpha Keep!');
  }, 1000); */




  return (
    <Box
      className='SearchPageContent'
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexGrow: 1,
        p: 3,
        marginTop: `${currentAppBarHeight + 10}px`,
        marginLeft: `${calculatedMarginLeft}px`,
        /* marginLeft: "60px", */
        transition: 'margin-left 0.3s ease, margin-top 0.3s ease',
        gap: "32px",

      }}
    >

      {/* Modelo 01 */}
      <Box sx={{
        display: 'flex',
        backgroundColor: 'white',
        borderRadius: '35px',
        padding: '16px 40px',
        boxShadow: '1px 4px 4px #939393',
        gap: '32px',
        minWidth: '320px'
      }}>
        <img src="/smile2.svg" alt="ia icon" style={imageStyle}></img>
        <Box>
          <Typography sx={{ fontSize: '16px', maxWidth: '600px', mt: '6px', mb: '4px' }}>
            {displayText}
          </Typography>
          <Typography sx={{ fontSize: '16px', maxWidth: '600px', mb: '4px' }}>
            {displayText2}
          </Typography>
        </Box>
      </Box>

      {/* Modelo 02 */}
      {/*  <Box sx={{
        display: 'flex',
        borderRadius: '35px',
        padding: '4px 40px',
        gap: '16px',
        alignItems: 'center',
      }}>
        <img src="/smile2.svg" alt="ia icon" style={imageStyle2}></img>
        <Box className="chat-card left"> Faça buscas mais elaboradas com ajuda da IA!</Box>
      </Box>
      <Box sx={{
        display: 'flex',
        borderRadius: '35px',
        padding: '4px 40px',
        gap: '16px',
        alignItems: 'center',
      }}>
        <Box className="chat-card right"> Faça buscas mais elaboradas com ajuda da IA!</Box>
        <AccountCircle style={imageStyle2} />
      </Box> */}

      {/* <Card style={{ padding: '16px', margin: '16px' }}>
        <Typography >Typing Effect</Typography>
        <Typography >{displayedText}</Typography>
      </Card> */}

      <Box sx={{ display: "flex", alignItems: "start", width: "100%" }}>
        <NoteCardList notes={searchedNotes} />
      </Box>
    </Box>
  )
};

export default SearchPageContent;
