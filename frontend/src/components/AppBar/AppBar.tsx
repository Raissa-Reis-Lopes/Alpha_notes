import './AppBar.css';
import React, { useState } from 'react';
import { AppBar as MuiAppBar, Toolbar, IconButton, Box, Badge, Menu, MenuItem } from '@mui/material';
import SearchBar from '../SearchBar/SearchBar';
import { styled, useTheme } from '@mui/material/styles';
import {
  Menu as MenuIcon, Notifications as NotificationsIcon, MoreVert as MoreIcon,
  AccountCircle, ViewAgendaOutlined, SettingsOutlined
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

interface AppBarProps {
  handleDrawerToggle: () => void;
  handleMobileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  mobileMenuId: string;
  menuId: string;
}

const Logo = styled('img')(({ theme }) => ({
  width: '76px'
}));

const AppBar: React.FC<AppBarProps> = ({ handleDrawerToggle, handleMobileMenuOpen, mobileMenuId, menuId }) => {
  const theme = useTheme();
  const darkTheme = true;
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    console.log('Usuário deslogado');

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_ADDRESS}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setUser(null);
        navigate('/login');
      } else {
        console.error('Erro ao fazer logout:', response.statusText);
      }
    } catch (error) {
      console.error('Erro de rede ao fazer logout:', error);
    } finally {
      handleMenuClose();
    }
  };


  return (
    <MuiAppBar position="fixed" elevation={0}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: `${darkTheme ? "#371c44" : "initial"}`,
        border: "1px solid #0000001f"
      }}>
      <Toolbar sx={{ justifyContent: 'space-between', marginTop: '8px' }}>
        <Box sx={{ flexGrow: 0, display: 'flex', justifyContent: 'start' }}>
          <IconButton edge="start" aria-label="open drawer" onClick={handleDrawerToggle} sx={{
            ":hover": {
              backgroundColor: "#ffffff20",
            }
          }}>
            <MenuIcon sx={{ color: `${darkTheme ? "#fff" : "initial"}` }} />
          </IconButton>
          <Logo src="/logo.svg" sx={{ margin: "0 24px" }} className='logo'></Logo>
        </Box>

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <SearchBar />
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <IconButton color={darkTheme ? 'inherit' : 'default'} sx={{
            ":hover": {
              backgroundColor: "#ffffff20",
            }
          }} >
            <Badge>
              <ViewAgendaOutlined />
            </Badge>
          </IconButton>
          <IconButton color={darkTheme ? 'inherit' : 'default'} sx={{
            ":hover": {
              backgroundColor: "#ffffff20",
            }
          }}>
            <Badge badgeContent={17} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color={darkTheme ? 'inherit' : 'default'} sx={{
            ":hover": {
              backgroundColor: "#ffffff20",
            }
          }}>
            <Badge >
              <SettingsOutlined />
            </Badge>
          </IconButton>
          <IconButton edge="end" onClick={handleProfileMenuOpen} aria-controls={menuId}
            color={darkTheme ? 'inherit' : 'default'} sx={{
              ":hover": {
                backgroundColor: "#ffffff20",
              }
            }}
          >
            <AccountCircle />
          </IconButton>
        </Box>

        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton onClick={handleMobileMenuOpen} aria-controls={mobileMenuId} sx={{
            ":hover": {
              backgroundColor: "#ffffff20",
            }
          }}>
            <MoreIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Menu de Logout */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </MuiAppBar>
  );
};

export default AppBar;
