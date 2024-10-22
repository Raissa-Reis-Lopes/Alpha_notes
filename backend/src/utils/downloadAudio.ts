import { exec } from "youtube-dl-exec";
import path from "path";

export async function downloadAudioFromYouTube(videoURL: string, audioDir: string): Promise<string> {

    const audioOutput = path.join(audioDir, `audio-${Date.now()}.mp3`);

    try {
        await exec(videoURL, {
            extractAudio: true,
            audioFormat: "mp3",
            output: audioOutput,
            ffmpegLocation: "C:\\ffmpeg\\ffmpeg-master-latest-win64-gpl\\bin",
            verbose: true,
        });

        return audioOutput;
    } catch (error: any) {
        throw new Error(`Erro ao baixar áudio: ${error.message}`);
    }
}
