import pkg from "youtube-dl-exec";
const { exec } = pkg;
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import path from "path";

export async function downloadAudioFromYouTube(videoURL: string, outputPath: string): Promise<string> {
    const __filename = fileURLToPath(import.meta.url); // Funciona mesmo com erro
    const __dirname = dirname(__filename);
  
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