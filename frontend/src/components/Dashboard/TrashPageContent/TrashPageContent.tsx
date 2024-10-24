import './TrashPageContent.css';
import React, { useEffect } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Typography } from '@mui/joy';
import { DescriptionOutlined } from '@mui/icons-material';
import { useUser } from '../../../contexts/UserContext';
import TrashNoteList from '../../TrashNoteList/TrashNoteList';
import { useNotes } from '../../../contexts/NotesContext';

interface TrashPageContentProps {
  drawerOpen: boolean;
  drawerWidth: number;
  miniDrawerWidth: number;
  appBarHeight: number;
  miniAppBarHeight: number;
}

const TrashPageContent: React.FC<TrashPageContentProps> = ({
  drawerOpen,
  drawerWidth,
  miniDrawerWidth,
  appBarHeight,
  miniAppBarHeight,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const currentAppBarHeight = isMobile ? miniAppBarHeight : appBarHeight;
  const calculatedMarginLeft = drawerOpen ? drawerWidth : miniDrawerWidth;
  
  const { user } = useUser();
  const { getAllNotes, trashNotes } = useNotes();

  useEffect(() => {
    if (user) {
      getAllNotes('trash'); // Chama com o filtro para notas excluídas
    }
  }, [user]);  

  return (
    <Box
      className='trash-page-content'
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexGrow: 1,
        p: 3,
        marginTop: `${currentAppBarHeight + 10}px`,
        marginLeft: `${calculatedMarginLeft}px`,
        transition: 'margin-left 0.3s ease, margin-top 0.3s ease',
        gap: "32px"
      }}
    ><Typography style={{ fontSize: '2.2rem' , fontFamily: 'Fredoka, sans-serif', color: '#8f5bbd', fontWeight: '500'}} gutterBottom>
    - notas excluídas -
       </Typography>
      <Box sx={{ display: "flex", alignItems: "start", width: "100%", flexWrap: "wrap", gap: "16px" }}>
        {trashNotes.length > 0 ? (
          <TrashNoteList notes={trashNotes} />
        ) : (
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginTop: "10vh"
          }}>
            <DescriptionOutlined sx={{ fontSize: "100px", opacity: "0.1" }} />
            <Typography sx={{ fontSize: "24px", color: "#5f6368", textAlign: "center" }}>
              Nenhuma anotação encontrada na lixeira
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TrashPageContent;
