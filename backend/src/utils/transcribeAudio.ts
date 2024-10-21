const { downloadAudioFromYouTube } = require("./downloadAudio");
const { OpenAIWhisperAudio } = require("@langchain/community/document_loaders/fs/openai_whisper_audio");



export const transcribeAudio = async function (videoURL: string, name: string) {
    const filePath = `${name}-${Date.now()}.mp3`;

    const audioFilePath = await downloadAudioFromYouTube(videoURL, filePath);
    const loader = new OpenAIWhisperAudio(audioFilePath);
    const docs = await loader.load();

    console.log(docs);
    return docs
};