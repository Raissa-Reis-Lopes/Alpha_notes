import { downloadAudioFromYouTube } from "./downloadAudio";
import dotenv from "dotenv";
dotenv.config();
import { OpenAIWhisperAudio } from "@langchain/community/document_loaders/fs/openai_whisper_audio";

export async function transcribeAudio (videoURL: string, name: string) {
    const filePath = `${name}-${Date.now()}.mp3`;
    
    const audioFilePath = await downloadAudioFromYouTube(videoURL, filePath);
    const loader = new OpenAIWhisperAudio(audioFilePath);
    const docs = await loader.load();
    
    console.log(docs);
}