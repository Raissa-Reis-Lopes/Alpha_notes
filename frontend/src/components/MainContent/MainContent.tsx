import React, { useContext } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import './MainContent.css';
import { UserContext, useUser } from '../../contexts/UserContext';
import NoteInput from '../NoteInput/NoteInput';
import NoteCardList from '../NoteCard/NoteCardList';
import { useNotes } from '../../contexts/NotesContext';

interface MainContentProps {
  drawerOpen: boolean;
  drawerWidth: number;
  miniDrawerWidth: number;
  appBarHeight: number
  miniAppBarHeight: number;
}

const MainContent: React.FC<MainContentProps> = ({ drawerOpen, drawerWidth, miniDrawerWidth, appBarHeight, miniAppBarHeight }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const currentAppBarHeight = isMobile ? miniAppBarHeight : appBarHeight;
  const calculatedMarginLeft = drawerOpen ? drawerWidth : miniDrawerWidth;

  const { user } = useUser();
  const { notes } = useNotes();
  return (
    <Box
      className='MainContent'
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexGrow: 1,
        p: 3,
        marginTop: `${currentAppBarHeight}px`,
        marginLeft: `${calculatedMarginLeft}px`,
        transition: 'margin-left 0.3s ease, margin-top 0.3s ease',
        gap: "32px"
      }}
    >
      {/* Seu conteúdo principal aqui */}
      <span>Bem-vindo, {user ? user : "N/A"}!</span>
      <NoteInput any={undefined} />
      <Box sx={{ display: "flex", alignItems: "start", width: "100%" }}>
        <NoteCardList notes={notes} />
      </Box>
    </Box>
  )
};

export default MainContent;
