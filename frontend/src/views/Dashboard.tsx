import React, { useContext, useState } from 'react';
import { UserContext, useUser } from '../contexts/UserContext';
import AppBar from '../components/AppBar/AppBar';
import Drawer from '../components/Drawer/Drawer';
import MainContent from '../components/Dashboard/MainContent/MainContent';
import MobileMenu from '../components/MobileMenu/MobileMenu';
import { CssBaseline } from '@mui/material';
import SearchPageContent from '../components/Dashboard/SearchPageContent/SearchPageContent';
import { useParams } from 'react-router-dom';
import ArchivePageContent from '../components/Dashboard/ArchivePageContent.tsx/ArchivePageContent';
import TrashPageContent from '../components/Dashboard/TrashPageContent/TrashPageContent';
import { Box } from '@mui/joy';

const drawerWidth = 240;
const miniDrawerWidth = 60;
const appBarHeight = 64;
const miniAppBarHeight = 56;

const Dashboard: React.FC = () => {
  const { user } = useUser();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => setMobileMoreAnchorEl(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const mobileMenuId = 'primary-search-account-menu-mobile';
  const menuId = 'primary-search-account-menu';

  const { section } = useParams<{ section: string }>();
  const currentSection = section || 'notes';

  return (
    <Box sx={{ display: "flex", flex: 1 }}>
      {user ? (
        <>
          <AppBar
            handleDrawerToggle={handleDrawerToggle}
            handleProfileMenuOpen={handleProfileMenuOpen}
            handleMobileMenuOpen={handleMobileMenuOpen}
            mobileMenuId={mobileMenuId}
            menuId={menuId}
          />
          <Drawer drawerOpen={drawerOpen} toggleDrawer={handleDrawerToggle} />
          {currentSection === 'notes' && 
            <MainContent
              drawerOpen={drawerOpen}
              drawerWidth={drawerWidth}
              miniDrawerWidth={miniDrawerWidth}
              appBarHeight={appBarHeight}
              miniAppBarHeight={miniAppBarHeight}
            />
          }
          {currentSection === 'search' && 
            <SearchPageContent
              drawerOpen={drawerOpen}
              drawerWidth={drawerWidth}
              miniDrawerWidth={miniDrawerWidth}
              appBarHeight={appBarHeight}
              miniAppBarHeight={miniAppBarHeight}
            />
          }
          {currentSection === 'archive' && 
            <ArchivePageContent
              drawerOpen={drawerOpen}
              drawerWidth={drawerWidth}
              miniDrawerWidth={miniDrawerWidth}
              appBarHeight={appBarHeight}
              miniAppBarHeight={miniAppBarHeight}
            />
          }
          {currentSection === 'trash' && 
            <TrashPageContent
              drawerOpen={drawerOpen}
              drawerWidth={drawerWidth}
              miniDrawerWidth={miniDrawerWidth}
              appBarHeight={appBarHeight}
              miniAppBarHeight={miniAppBarHeight}
            />
          }

          <MobileMenu
            mobileMoreAnchorEl={mobileMoreAnchorEl}
            mobileMenuId={mobileMenuId}
            isMobileMenuOpen={isMobileMenuOpen}
            handleMobileMenuClose={handleMobileMenuClose}
            handleProfileMenuOpen={handleProfileMenuOpen}
          />
        </>
      ) : (
        <p>Please log in.</p>
      )}
    </Box>
  );
};

export default Dashboard;
