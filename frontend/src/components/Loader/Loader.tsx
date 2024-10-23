import CircularProgress from '@mui/joy/CircularProgress';
import './Loader.css';
import Link from '@mui/joy/Link';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import Chip from '@mui/joy/Chip';
import Box from '@mui/joy/Box';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


interface LoaderProps {
  className?: string;
  title?: string;
}

interface LoaderIA {
  status?: string;
}

export const Loader: React.FC<LoaderProps> = ({ className, title, ...props }) => {
  return (
    <div className={`${className} loader`} title={title}></div>
  );
};


export const LoadIA: React.FC<LoaderIA> = ({ status }) => {
  if (!status) return
  return (
    <>
      {status === 'processing' && (

        <Link
          component="button"
          variant="plain"
          startDecorator={<CircularProgress />}
          sx={{ p: 1, alignSelf: 'self-end', fontSize: '10px' }}
          title={'A IA está processando o conteúdo da nota'}
        >
          Processando...
        </Link>
      )}

      {status === 'pending' && (
        <Box title={'Processamento pendente'}
          sx={{ alignSelf: 'self-end' }}>
          <HourglassEmptyOutlinedIcon sx={{
            backgroundColor: 'faf7f3',
            borderRadius: '50%',
            color: '#cb8d0b',
            fontSize: '16px',
            padding: '2px',

          }} />
        </Box>
      )}

      {status === 'completed' && (
        <Box title={'Conteúdo da nota processado com sucesso'}
          sx={{ alignSelf: 'self-end' }}>
          <CheckCircleIcon sx={{
            backgroundColor: '#f3f7fa',
            borderRadius: '50%',
            color: '#0b6bcb',
            fontSize: '16px',
            padding: '2px',

            position: 'fixed',
            top: '8px',
            right: '8px',

          }} />
        </Box>
      )}

    </>
  )
}
