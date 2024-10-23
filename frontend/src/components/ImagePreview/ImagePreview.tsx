import React from 'react';
import { IconButton, AspectRatio } from '@mui/joy';
import CloseIcon from '@mui/icons-material/Close'; // Importando o ícone de fechar
import { Dialog } from '@mui/material';

interface ImagePreviewModalProps {
  open: boolean; // Estado que controla se o modal está aberto
  onClose: () => void; // Função para fechar o modal
  imageUrl: string | null; // URL da imagem a ser exibida
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ open, onClose, imageUrl }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <IconButton 
        aria-label="close" 
        onClick={onClose} 
        style={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      {imageUrl && (
        <AspectRatio ratio="16/9" style={{ width: '100%', height: '100%' }}>
          <img src={imageUrl} alt="Imagem em tamanho maior" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </AspectRatio>
      )}
    </Dialog>
  );
};

export default ImagePreviewModal;













//import './ImagePreview.css';
/* 
interface ImagePreviewProps {
    url: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ url }) => {
  return (
   
    <div id="modalPreviewImage" className="w-100 h-100 d-none box-column p-4">
    <section className="w-100 h-100 box-column">

        <div className="box-column">
            <button className="btn" >
                <i className="bi bi-x-lg fs-2"></i>
            </button>
        </div>

        <div className="w-100 h-100 box-column">
            <img id="image-preview" src="" alt="preview"/>
        </div>
    </section>
</div>
   
   
  )
};

export default ImagePreview;
 */