export const inputBorder = {
  components: {
    JoyInput: {
      styleOverrides: {
        root: {
          border: '2px solid #00bf74', // Cor do contorno padrão
          borderRadius: '4px', // Adicionando um pouco de arredondamento
          '&:hover': {
            border: '2px solid #00bf74', // Cor do contorno ao passar o mouse
          },
          '&.Mui-focused': {
            border: '2px solid #00bf74', // Cor do contorno ao focar
          },
          '&.Mui-error': {
            border: '2px solid #00bf74', // Cor do contorno em caso de erro
          },
          '&:focus': {
            border: '2px solid #00bf74 ', // Cor do contorno ao focar
            boxShadow: 'none', // Remover o efeito de sombra padrão
          },
        },
      },
    },
  },
};