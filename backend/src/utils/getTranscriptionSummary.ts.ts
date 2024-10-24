import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export async function getTranscriptionSummary(transcription: string) {
    try {
        if (!transcription) {
            throw new Error("Transcription is empty or undefined.");
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: `Resuma o seguinte texto em no máximo 100 palavras: \n\n${transcription}`
                }
            ],
        });

        const summary = response.choices[0]?.message.content;

        if (!summary) {
            throw new Error("Erro ao gerar o resumo.");
        }

        return summary;
    } catch (error) {
        console.error("Erro ao gerar o resumo da transcrição:", error);
        throw error;
    }
}
