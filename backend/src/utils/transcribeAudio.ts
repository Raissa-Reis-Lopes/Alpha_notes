const { downloadAudioFromYouTube } = require("./downloadAudio");
const { OpenAIWhisperAudio } = require("@langchain/community/document_loaders/fs/openai_whisper_audio");

export const transcribeAudio = async function (audioDownloaded: string) {

    console.log("audioDownloaded")
    console.log(audioDownloaded)

    const loader = new OpenAIWhisperAudio(audioDownloaded);
    const docs = await loader.load();

    console.log(docs);
    return docs
};