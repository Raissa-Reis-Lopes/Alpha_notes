export const extractYoutubeId = (url: string) => {
    // Primeiro, garantir que a URL comece com http/https para evitar problemas
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    // Expressões regulares para diferentes formatos de URL do YouTube
    const regExpPatterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i,
    ];

    for (const pattern of regExpPatterns) {
      const match = formattedUrl.match(pattern);
      if (match && match[1]) {
        return match[1]; // Retorna o ID do vídeo se encontrado
      }
    }

    return null; // Retorna null se não for uma URL válida do YouTube
  };