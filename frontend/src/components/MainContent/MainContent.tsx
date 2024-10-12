import React, { useContext } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import './MainContent.css';
import { UserContext, useUser } from '../../contexts/UserContext';

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
  return (
    <Box
      className='MainContent'
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        marginTop: `${currentAppBarHeight}px`,
        marginLeft: `${calculatedMarginLeft}px`,
        transition: 'margin-left 0.3s ease, margin-top 0.3s ease',
      }}
    >
      {/* Seu conteúdo principal aqui */}
      <p>Welcome, {user ? user : "N/A"}!</p>
      <h1>Conteúdo Principal</h1>
    </Box>
  )
};

export default MainContent;
