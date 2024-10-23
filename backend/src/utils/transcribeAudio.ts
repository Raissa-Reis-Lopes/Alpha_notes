const { OpenAIWhisperAudio } = require("@langchain/community/document_loaders/fs/openai_whisper_audio");

export const transcribeAudio = async function (audioDownloaded: string) {

    const loader = new OpenAIWhisperAudio(audioDownloaded);
    const docs = await loader.load();

    return docs
};