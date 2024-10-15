import React from 'react';
import { Drawer as MuiDrawer, List, ListItem, ListItemText, ListItemIcon, useTheme, useMediaQuery } from '@mui/material';
import { Home, Mail, DescriptionOutlined, ArchiveOutlined, DeleteOutlined, Image, Videocam } from '@mui/icons-material';
import { IconButton, ListItemButton, ListItemDecorator } from '@mui/joy';


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
      {drawerOpen ?


        <List>
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
        :
        <List sx={{ display: "flex", flexDirection: "column" }}>
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

      }

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