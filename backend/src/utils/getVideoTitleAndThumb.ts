import youtubedl from 'youtube-dl-exec';
import dotenv from "dotenv";
dotenv.config();

interface VideoInfo {
    title: string;
    thumbnail: string;
}

export async function getVideoInfo(videoURL: string): Promise<VideoInfo> {
    try {
        const info = await youtubedl(videoURL, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            proxy: process.env.PROXY
        }) as { title: string; thumbnail: string };

        return {
            title: info.title,
            thumbnail: info.thumbnail,
        };
    } catch (error: any) {
        throw new Error(`Erro ao obter informações do vídeo: ${error.message}`);
    }
}