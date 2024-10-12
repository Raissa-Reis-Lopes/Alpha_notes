import React from 'react';
import { AppBar as MuiAppBar, Toolbar, Typography, IconButton, Box, Badge } from '@mui/material';
import { Menu as MenuIcon, Mail as MailIcon, Notifications as NotificationsIcon, AccountCircle, MoreVert as MoreIcon } from '@mui/icons-material';
import SearchBar from '../SearchBar/SearchBar';

import { useTheme } from '@mui/material/styles';


interface AppBarProps {
  handleDrawerToggle: () => void;
  handleProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleMobileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  mobileMenuId: string;
  menuId: string;
}



const AppBar: React.FC<AppBarProps> = ({ handleDrawerToggle, handleProfileMenuOpen, handleMobileMenuOpen, mobileMenuId, menuId }) => {
  const theme = useTheme();
  return (
    <MuiAppBar position="fixed" elevation={0} sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      {/* <MuiAppBar position="fixed"> */}
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={handleDrawerToggle}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          MUI
        </Typography>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <SearchBar />
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <MailIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <Badge badgeContent={17} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton edge="end" color="inherit" onClick={handleProfileMenuOpen} aria-controls={menuId}>
            <AccountCircle />
          </IconButton>
        </Box>
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton color="inherit" onClick={handleMobileMenuOpen} aria-controls={mobileMenuId}>
            <MoreIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </MuiAppBar>
  )
};

export default AppBar;
