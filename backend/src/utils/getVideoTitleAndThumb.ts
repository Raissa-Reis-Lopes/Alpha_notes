import ytdl from 'ytdl-core';

interface VideoInfo {
    title: string;
    thumbnail: string;
}

export async function getVideoInfo(videoURL: string): Promise<VideoInfo> {
    try {
        const info = await ytdl.getInfo(videoURL);

        return {
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails[0].url,
        };
    } catch (error: any) {
        throw new Error(`Erro ao obter informações do vídeo: ${error.message}`);
    }
}