const { OpenAIWhisperAudio } = require("@langchain/community/document_loaders/fs/openai_whisper_audio");

export const transcribeAudio = async function (audioDownloaded: string) {
    try {
        const loader = new OpenAIWhisperAudio(audioDownloaded);
        const docs = await loader.load();

        return docs;
    } catch (error: any) {
        console.error(`Erro ao transcrever o áudio: ${error.message}`);
        return { transcription: "Não foi possível transcrever" };
    }
};