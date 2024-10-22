import { exec } from "youtube-dl-exec";
import { dirname } from "path";
import fs from "fs";
import path from "path";

export async function downloadAudioFromYouTube(videoURL: string, audioDir: string): Promise<string> {

    const audioOutput = path.join(audioDir, `audio-${Date.now()}.mp3`);

    console.log("audioDir")
    console.log(audioDir)

    try {
        await exec(videoURL, {
            extractAudio: true,
            audioFormat: "mp3",
            output: audioOutput,
            ffmpegLocation: "C:\\ffmpeg\\ffmpeg-master-latest-win64-gpl\\bin",
            verbose: true,  // Adiciona mais informações sobre o que está acontecendo
        });

        console.log("audioOutput na função de donwload")
        console.log(audioOutput)

        return audioOutput;
    } catch (error: any) {
        throw new Error(`Erro ao baixar áudio: ${error.message}`);
    }
}
