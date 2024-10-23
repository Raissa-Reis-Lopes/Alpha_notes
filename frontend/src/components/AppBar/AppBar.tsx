
import './AppBar.css'
import React from 'react';
import { AppBar as MuiAppBar, Toolbar, Typography, IconButton, Box, Badge } from '@mui/material';
import SearchBar from '../SearchBar/SearchBar';
import { styled, useTheme } from '@mui/material/styles';
import {
  Menu as MenuIcon, Mail as MailIcon, Notifications as NotificationsIcon, MoreVert as MoreIcon,
  AccountCircle, ViewAgendaOutlined, GridViewOutlined, SettingsOutlined
} from '@mui/icons-material';



interface AppBarProps {
  handleDrawerToggle: () => void;
  handleProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleMobileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  mobileMenuId: string;
  menuId: string;
}

const Logo = styled('img')(({ theme }) => ({
  width: '76px'

}));

const AppBar: React.FC<AppBarProps> = ({ handleDrawerToggle, handleProfileMenuOpen, handleMobileMenuOpen, mobileMenuId, menuId }) => {
  const theme = useTheme();
  const darkTheme = true;
  return (
    <MuiAppBar position="fixed" elevation={0}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: `${darkTheme ? "#371c44" : "initial"}`,
        border: "1px solid #0000001f"
      }}>

      {/* <MuiAppBar position="fixed"> */}
      <Toolbar sx={{ justifyContent: 'space-between' }}>

        <Box sx={{ flexGrow: 0, display: 'flex', justifyContent: 'start' }}>
          <IconButton edge="start" aria-label="open drawer" onClick={handleDrawerToggle} sx={{
            ":hover": {
              backgroundColor: "#ffffff20",
            }
          }}>
            <MenuIcon sx={{ color: `${darkTheme ? "#fff" : "initial"}` }} />
          </IconButton>
          {/* <Typography variant="h6" noWrap sx={{ color: "#0000008a", alignSelf: "center", margin: "0 24px" }}>
            MUI
          </Typography> */}
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
    </MuiAppBar>
  )
};

export default AppBar;
