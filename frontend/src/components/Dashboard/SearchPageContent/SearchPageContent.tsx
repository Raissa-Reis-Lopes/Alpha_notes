import './SearchPageContent.css';
import React, { useEffect } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useUser } from '../../../contexts/UserContext';
import NoteInput from '../../Note/NoteInput/NoteInput';
import NoteCardList from '../../Note/NoteCard/NoteCardList';
import { useNotes } from '../../../contexts/NotesContext';
import { CssBaseline } from '@mui/joy';

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
  const { searchedNotes } = useNotes();

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
        gap: "32px"
      }}
    >
      <p>Faça buscas mais elaboradas com ajuda da IA!</p>
      <Box sx={{ display: "flex", alignItems: "start", width: "100%" }}>
        <NoteCardList notes={searchedNotes} />
      </Box>
    </Box>
  )
};

export default SearchPageContent;
