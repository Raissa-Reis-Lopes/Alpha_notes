import React from 'react';
import { Grid, Card, CardContent, Typography, AspectRatio } from '@mui/joy';
import { IImage } from '../../../interface/image';

interface ImageCardProps {
  images: IImage[];
}

const ImageCard: React.FC<ImageCardProps> = ({ images }) => {
  const images2: IImage[] = [
    { id: '1', filename: 'https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318' },
    { id: '2', filename: 'https://pbs.twimg.com/profile_images/1701878932176351232/AlNU3WTK_400x400.jpg' },
    { id: '3', filename: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbscwqaPEk3_5Y90HOvwNvHtaaKceea9t2_A&s' },
    { id: '4', filename: 'https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318' },
    { id: '5', filename: 'https://pbs.twimg.com/profile_images/1701878932176351232/AlNU3WTK_400x400.jpg' },
    { id: '6', filename: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbscwqaPEk3_5Y90HOvwNvHtaaKceea9t2_A&s' },
    { id: '7', filename: 'https://pbs.twimg.com/profile_images/1701878932176351232/AlNU3WTK_400x400.jpg' },
    { id: '8', filename: 'https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318' },
    { id: '9', filename: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbscwqaPEk3_5Y90HOvwNvHtaaKceea9t2_A&s' },
  ];

  /* images = images2; */
  if (!images || images.length === 0) {
    return null; // Não renderiza nada se não houver imagens
  }


  const maxLargeImagesToShow = 3; // Máximo de imagens grandes
  const minSmallImagesToShow = 3; // Mínimo de imagens pequenas na segunda linha
  const maxSmallImagesToShow = 4; // Máximo de imagens pequenas na segunda linha


  const cardStyle = {
    width: '300px',
    padding: '0', // Removendo padding para maximizar o uso do espaço
    position: 'relative' as 'relative', // Para compatibilidade com TypeScript

    maxHeight: '180px',
    overflow: 'hidden',
  };

  const imageWrapperStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as 'cover', // Para compatibilidade com TypeScript
    maxHeight: '180px',
  };



  const imagesToShow = Array.isArray(images) ? [...images].slice(-7) : [];
  // Pega até 7 últimas imagens (descartando do início)

  let largeImagesToShow = Math.min(maxLargeImagesToShow, imagesToShow.length);
  let smallImagesToShow = 0; // Inicialmente, nenhuma imagem pequena a ser mostrada

  if (imagesToShow.length === 4) {
    largeImagesToShow = 1; // Se 4 imagens, mostrar 1 na primeira linha
    smallImagesToShow = 3; // E 3 na segunda linha
  } else if (imagesToShow.length === 5) {
    largeImagesToShow = 2; // Se 5 imagens, mostrar 2 na primeira linha
    smallImagesToShow = 3; // E 3 na segunda linha
  } else if (imagesToShow.length >= 6) {
    largeImagesToShow = 3; // Se 6 ou mais, mostrar 3 na primeira linha
    smallImagesToShow = Math.min(maxSmallImagesToShow, imagesToShow.length - largeImagesToShow); // O restante na segunda linha
  } else {
    // Caso contrário, mostramos todas as imagens na primeira linha
    largeImagesToShow = imagesToShow.length;
  }

  return (
    <Card variant="outlined" style={cardStyle}>
      <Grid container spacing={0.5}>
        {/* Renderiza imagens na primeira linha */}
        {imagesToShow.slice(-largeImagesToShow).map((img) => (
          <Grid xs={12 / largeImagesToShow} key={img.id} style={{ flexGrow: 1 }}>
            <AspectRatio ratio="4/3">
              <img src={`alpha04.alphaedtech.org.br:3001/${img.filename}`} alt={`Imagem ${img.id + 1}`} style={imageWrapperStyle} />
            </AspectRatio>
          </Grid>
        ))}

        {/* Renderiza imagens na segunda linha */}
        {imagesToShow.slice(0, smallImagesToShow).map((img) => (
          <Grid xs={3} key={img.id} style={{ flexGrow: 1 }}> {/* Garantindo que a segunda linha tenha 3 ou 4 imagens */}
            <AspectRatio ratio="4/3" >
              <img src={`alpha04.alphaedtech.org.br:3001/${img.filename}`} alt={`Imagem ${img.id + largeImagesToShow + 1}`} style={imageWrapperStyle} />
            </AspectRatio>
          </Grid>
        ))}
      </Grid>

    </Card>
  );
};


export default ImageCard;



/* import React from 'react';
import { Grid, Card, CardMedia, Typography } from '@mui/material';
import styled from 'styled-components';
import { AspectRatio, CardContent } from '@mui/joy';

const StyledCard = styled(Card)`
  width: 300px;
  padding: 10px;
  position: relative;
`;

const ImageWrapper = styled(AspectRatio)<{ multiple: boolean }>`
  height: ${({ multiple }) => (multiple ? '100px' : '200px')};
  width: ${({ multiple }) => (multiple ? '100px' : '100%')};
  object-fit: cover;
  margin: ${({ multiple }) => (multiple ? '5px' : '0')};
`;

interface ImageCardProps {
  images: string[];  // Array de URLs de imagens
  title: string;     // Título do card
}





const ImageCard: React.FC = () => {
    const maxImagesToShow = 4;  // Número máximo de imagens a serem exibidas
    const img = [
        'https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318',
      'https://pbs.twimg.com/profile_images/1701878932176351232/AlNU3WTK_400x400.jpg',
      'https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318',
      'https://pbs.twimg.com/profile_images/1701878932176351232/AlNU3WTK_400x400.jpg',
      'https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318',
      'https://pbs.twimg.com/profile_images/1701878932176351232/AlNU3WTK_400x400.jpg',
      ];
  
    return (
      <StyledCard variant="outlined">
        <Grid container spacing={1}>
          {img.length === 1 ? (
            // Renderiza uma imagem grande
            <ImageWrapper ratio="4/3" multiple={false}>
              <img src={img[0]} alt="Imagem" />
            </ImageWrapper>
          ) : (
            // Renderiza várias imagens menores
            img.slice(0, maxImagesToShow).map((img, index) => (
              <Grid item xs={6} key={index}>
                <ImageWrapper ratio="4/3" multiple={true}>
                  <img src={img} alt={`Imagem ${index + 1}`} />
                </ImageWrapper>
              </Grid>
            ))
          )}
        </Grid>

        <CardContent>
          <Typography>{"title"}</Typography>
        </CardContent>
      </StyledCard>
    );
  };
  
  export default ImageCard;
 */