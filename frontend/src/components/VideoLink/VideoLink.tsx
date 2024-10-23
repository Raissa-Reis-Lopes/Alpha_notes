import './VideoLink.css'
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import { IUrl } from '../../interface/url';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { useState } from 'react';

interface VideoLinkProps {
  urls: IUrl[];
}


const VideoLink: React.FC<VideoLinkProps> = ({ urls }) => {
  const [hoveredChip, setHoveredChip] = useState<string | null>(null);

  const url2: IUrl[] = [
    { id: '1', url: 'https://www.youtube.com/watch?v=4wRX7nAs06g', title: 'Intel XDK/IONIC [9] - BANCO DE DADOS ONLINE' },
    { id: '2', url: 'https://www.youtube.com/watch?v=dyD_LpP3b7E', title: '[Live] Self-assessment (PDI) para carreira de Devs Web3' },
    { id: '3', url: 'https://www.youtube.com/watch?v=COGWtCxmxrI&', title: 'Jorge Ben Jor - Menina Mulher da Pele Preta (Áudio)' },
    /*     { id: '4', url: 'https://www.youtube.com/shorts/-KVXIT98neM' },
        { id: '5', url: 'https://www.youtube.com/watch?v=UqHh6TvGQIQ' }, */
  ];

  //urls = url2;
  if (!urls || urls.length === 0) {
    return null;
  }

  const handleMouseEnter = (id: string) => {
    setHoveredChip(id);
  };

  const handleMouseLeave = () => {
    setHoveredChip(null);
  };

  return (
    <Box sx={{
      display: 'flex', gap: 1, alignItems: 'center',
      flexDirection: 'column',


    }}>
      {urls.map((url) => (
        <Chip key={url.id} variant="soft"
          startDecorator={<YouTubeIcon sx={{ color: '#fe0032', pt: '0.5px' }} />}
          onMouseEnter={() => handleMouseEnter(url.id)}
          onMouseLeave={handleMouseLeave}
          sx={{
            fontSize: 13,
            //backgroundColor: '#371c44',
            padding: '0.4rem 1rem 0.4rem 0.8rem',
            borderRadius: '4px',
            marginLeft: 'auto',
            //color: 'white',
            cursor: 'pointer',
            '&:hover': {
              color: '#00bf74',
            },
            maxWidth: '300px',

            /* overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis', */
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'inline-block',
              transition: 'transform 5s linear',
              transform: hoveredChip === url.id ? 'translateX(-100%)' : 'translateX(0)',
              willChange: 'transform',
              whiteSpace: 'nowrap',
            }}
          >
            {/* {hoveredChip === url.id ? url.url : url.transcription} */}
            {url.title} {/* TODO: TITULO PROVISORIO */}
          </Box>
        </Chip>
      ))}
    </Box>
  );
}

export default VideoLink;
