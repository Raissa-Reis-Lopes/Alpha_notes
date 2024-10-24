import React from 'react';
import { Drawer as MuiDrawer, List, ListItem, ListItemText, ListItemIcon, useTheme, useMediaQuery } from '@mui/material';
import { Home, Mail, DescriptionOutlined, ArchiveOutlined, DeleteOutlined, Image, Videocam } from '@mui/icons-material';
import { IconButton, ListItemButton, ListItemDecorator } from '@mui/joy';
import { Link } from 'react-router-dom';


interface DrawerProps {
  drawerOpen: boolean;
  toggleDrawer: () => void;
}

const drawerWidth = 240;
const miniDrawerWidth = 60;

const Drawer: React.FC<DrawerProps> = ({ drawerOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Verifica se é mobile
  const calculatedWidth = drawerOpen ? drawerWidth : miniDrawerWidth;

  const darkTheme = true;
  return (
    <MuiDrawer
      variant="permanent"
      open={drawerOpen}
      sx={{
        width: `${calculatedWidth}px`,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        '& .MuiDrawer-paper': {
          width: `${calculatedWidth}px`,
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          backgroundColor: `${darkTheme ? "#704784" : "initial"}`,
        },
      }}
      PaperProps={{
        sx: {
          top: isMobile ? '0px' : '64px',
          height: isMobile ? '100%' : 'calc(100% - 64px)',
          paddingTop: isMobile ? '64px' : '0px',
        },
      }}
    >

      <List >
        <ListItem component={Link} to="/dashboard/notes" sx={{
          color: `${darkTheme ? "#fff" : "initial"}`,
          ":hover": {
            backgroundColor: "#00bf74",
          }
        }}>
          <ListItemIcon><DescriptionOutlined sx={{ color: `${darkTheme ? "#fff" : "initial"}` }} /></ListItemIcon>
          {drawerOpen && <ListItemText sx={{ margin: 0, padding: 0 }} primary="Notas" />}
        </ListItem>
        <ListItem component={Link} to="/dashboard/archive"
          sx={{
            color: `${darkTheme ? "#fff" : "initial"}`,
            ":hover": {
              backgroundColor: "#00bf74",
            }
          }}>
          <ListItemIcon><ArchiveOutlined sx={{ color: `${darkTheme ? "#fff" : "initial"}` }} /></ListItemIcon>
          {drawerOpen && <ListItemText sx={{ margin: 0, padding: 0 }} primary="Arquivo" />}
        </ListItem>
        <ListItem component={Link} to="/dashboard/trash" sx={{
          color: `${darkTheme ? "#fff" : "initial"}`,
          ":hover": {
            backgroundColor: "#00bf74", //#f0f4f84f
          }
        }}>
          <ListItemIcon><DeleteOutlined sx={{ color: `${darkTheme ? "#fff" : "initial"}` }} /></ListItemIcon>
          {drawerOpen && <ListItemText sx={{ margin: 0, padding: 0 }} primary="Lixeira" />}
        </ListItem>
      </List>
      {/* {drawerOpen ?


        <List>
          <ListItem component={Link} to="/notes">
            <ListItemIcon ><DescriptionOutlined /></ListItemIcon>
            {drawerOpen && <ListItemText sx={{ margin: 0, padding: 0 }} primary="Notas" />}
          </ListItem>
          <ListItem component={Link} to="/archive">
            <ListItemIcon><ArchiveOutlined /></ListItemIcon>
            {drawerOpen && <ListItemText sx={{ margin: 0, padding: 0 }} primary="Arquivo" />}
          </ListItem>
          <ListItem component={Link} to="/trash">
            <ListItemIcon><DeleteOutlined /></ListItemIcon>
            {drawerOpen && <ListItemText sx={{ margin: 0, padding: 0 }} primary="Lixeira" />}
          </ListItem>
        </List>
        :
        <List sx={{ display: "flex", flexDirection: "column" }}>
         

          <ListItem component="li">
            <ListItemIcon><DescriptionOutlined /></ListItemIcon>
            {drawerOpen && <ListItemText sx={{ margin: 0, padding: 0 }} primary="Notas" />}
          </ListItem>
          <ListItem component="li">
            <ListItemIcon><ArchiveOutlined /></ListItemIcon>
            {drawerOpen && <ListItemText sx={{ margin: 0, padding: 0 }} primary="Arquivo" />}
          </ListItem>
          <ListItem component="li">
            <ListItemIcon><DeleteOutlined /></ListItemIcon>
            {drawerOpen && <ListItemText sx={{ margin: 0, padding: 0 }} primary="Lixeira" />}
          </ListItem>






        </List>

      } */}

    </MuiDrawer>
  );
};

export default Drawer;


{/* <List component="nav" sx={{ maxWidth: 320 }}>
          <ListItemButton>
            <ListItemDecorator>
              <Image />
            </ListItemDecorator>
            Add another image
          </ListItemButton>
          <ListItemButton>
            <ListItemDecorator>
              <Videocam />
            </ListItemDecorator>
            Add another video
          </ListItemButton>
        </List> */}


{/* <IconButton><DescriptionOutlined /></IconButton>
          <IconButton><ArchiveOutlined /></IconButton>
          <IconButton><DeleteOutlined /></IconButton> */}

{/* <ListItem >
            <IconButton><DescriptionOutlined /></IconButton>
          </ListItem>
          <ListItem >
            <IconButton><ArchiveOutlined /></IconButton>
          </ListItem>
          <ListItem >
            <IconButton><DeleteOutlined /></IconButton>
          </ListItem> */}