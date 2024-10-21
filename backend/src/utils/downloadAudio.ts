import { exec } from "youtube-dl-exec";
import { dirname } from "path";
import fs from "fs";
import path from "path";

const __filename = process.argv[1];
const __dirname = dirname(__filename);

export async function downloadAudioFromYouTube(videoURL: string, outputPath: string): Promise<string> {
    const audioDir = path.join(__dirname, "audio");
    if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir);
    }

    const audioOutput = path.join(audioDir, outputPath);

    try {
        await exec(videoURL, {
            extractAudio: true,
            audioFormat: "mp3",
            output: audioOutput,
        });

        return audioOutput;
    } catch (error: any) {
        throw new Error(`Erro ao baixar áudio: ${error.message}`);
    }
}
