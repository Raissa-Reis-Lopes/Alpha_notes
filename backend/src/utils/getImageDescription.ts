import fs from 'fs';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY, });

// Função para codificar a imagem em base64
const encodeImage = (imagePath: string): string => {
    const imageBuffer = fs.readFileSync(imagePath);
    return imageBuffer.toString('base64');
};

// Função para gerar a descrição da imagem usando a API da OpenAI
export async function getImageDescription(imagePath: string) {
    const base64Image = encodeImage(imagePath);

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: "Descreve em detalhes o que tem nessa imagem?" },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/jpeg;base64,${base64Image}`, // Envia a imagem como base64
                        },
                    },
                ],
            },
        ],
    });

    return response.choices[0].message;
}

