import React, { useEffect, useRef, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { InputBase } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import SwitchButton from '../SwitchButton/SwitchButton';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotes } from '../../contexts/NotesContext';


const Search = styled('div')(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  borderRadius: '2rem', // Ajuste o valor aqui para deixar mais arredondado
  backgroundColor: '#fbfcfe',
  '&:hover': {
    backgroundColor: '#f1f1f1',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    maxWidth: '600px',
  },
}));


const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.grey[700], // Cor do ícone
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary, // Cor do texto (ajustada para navbar branca)
  width: '100%', //new
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));


const SearchBar: React.FC = () => {

  const searchInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { section } = useParams<{ section: string }>();
  const { notes, searchedNotes, setSearchedNotes, searchNotesByQuery, setQueryString } = useNotes();

  useEffect(() => {
    if (searchInput.current) {
      searchInput.current.focus();
      searchInput.current.value = '';
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchInput.current) {
      return;
    }


  }

  const redirectToSearch = () => {
    if (section !== 'search') navigate('/dashboard/search');
  }


  const [searchTerm, setSearchTerm] = useState<string>('');
  useEffect(() => {
    if (searchTerm === '') {
      // Se o campo de pesquisa estiver vazio, limpa as notas filtradas
      setSearchedNotes([]);
    } else {
      // Caso contrário, filtra as notas com base no título e conteúdo
      const filteredNotes = notes.filter((note) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
          note.title.toLowerCase().includes(lowerSearchTerm) ||
          note.content.toLowerCase().includes(lowerSearchTerm)
        );
      });

      // Atualiza as notas filtradas no contexto
      setSearchedNotes(filteredNotes);
    }
  }, [searchTerm, setSearchedNotes]);






  const [switchState, setSwitchState] = useState<boolean>(false);

  const handleSwitchChange = (checked: boolean) => {
    console.log("Switch state", checked);
    setSwitchState(checked);
  };



  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {

      console.log('Enter pressed');
      const time = searchTerm.length < 100 ? 800 : 2200

      if (searchTerm && switchState) {
        console.log("aqui");
        setQueryString(searchTerm);
        setTimeout(() => {
          searchNotesByQuery(searchTerm);
          setSearchTerm('');
        }, time);


      }
      // Exemplo: chamar a função de busca ou realizar uma ação específica
      //performSearch(event.currentTarget.value); 
    }

  };

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Pesquisar..."
        inputProps={{ 'aria-label': 'search' }}
        onClick={redirectToSearch}
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
        onKeyDown={handleKeyDown}
      />
      <SwitchButton onChange={handleSwitchChange} />
    </Search>
  )
};
export default SearchBar;
