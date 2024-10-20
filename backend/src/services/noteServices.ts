// services/noteServices.ts
import * as noteRepository from "../repositories/noteRepository";
import { INote } from "../interfaces/note";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const openAIEmbeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_KEY,
});

// Função para dividir o texto em chunks usando o RecursiveCharacterTextSplitter
const splitTextIntoChunks = async (text: string, chunkSize: number, chunkOverlap: number = 0): Promise<string[]> => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: chunkSize,
        chunkOverlap: chunkOverlap,
    });
    const documents = await textSplitter.createDocuments([text]);
    return documents.map(doc => doc.pageContent);
};

// Função para gerar embeddings para cada chunk
const generateEmbeddingsForChunks = async (chunks: string[]): Promise<number[][]> => {
    const embeddings = await openAIEmbeddings.embedDocuments(chunks);
    return embeddings;
};

// // ESSA FUNÇÃO AQUI VAI TER QUE RECEBER OS ARRAYS DE IMAGENS E DE LINKS
// // DENTRO DA
// // Função para criar a nota sem embeddings inicialmente
// export const createNoteWithoutEmbeddings = async (
//     title: string,
//     content: string,
//     created_by: string,
//     images: [],
//     links: []
// ): Promise<INote> => {
//     try {

//         //ACESSA OS ARRAYS DE IMAGEM E DE LINK
//         //COM CADA UM DOS ARRAYS, CHAMA UMA FUNÇÃO DIFERENTE LÁ NO REPOSITORY PRA SALVAR ESSES DADOS NA TABELA DE IMAGEM E DE LINK
//         //addImage adiciona essas imagens no banco de dados
//         // for(const image of images){
//         //   pego cada um dos paths da imagem, passo pra função da IA que gera a descrição
//         //   com esse resultado, a gente passa como description pra salvar no banco das imagens 
//         //   noteRepository.createImage(noteId, imagePath, description)
//         //}

//         //Faz a mesma coisa pros links
//         // Com cada um dos arrays,




//         if (!title || !content) {
//             throw new Error("Title and content cannot be empty.");
//         }

//         // Criar a nota no repositório sem processar embeddings
//         const note = await noteRepository.createNote(title, content, created_by);
//         return note;
//     } catch (error) {
//         throw error;
//     }
// };


// //FUNÇÂO PARA extrair a descrição da imagem


// //FUNÇÂO na pasta util que o Pedro criou pra extrair a transcrição dos vídeos
// //acessa



// Função para criar a nota sem embeddings inicialmente
export const createNoteWithoutEmbeddings = async (
    title: string,
    content: string,
    created_by: string,
): Promise<INote> => {
    try {
        if (!title || !content) {
            throw new Error("Title and content cannot be empty.");
        }

        // Criar a nota no repositório sem processar embeddings
        const note = await noteRepository.createNote(title, content, created_by);
        return note;
    } catch (error) {
        throw error;
    }
};

// Função para processar embeddings e chunks em segundo plano
export const processEmbeddingsForNote = async (noteId: string, userId: string): Promise<void> => {
    try {
        // Obter a nota sem os embeddings
        const note = await noteRepository.getNoteById(noteId, userId);

        console.log("Essa é a nota que está tendo um novo embedding", note)


        // TRACSIRÇÃO DOS VIDEOS
        // DESCRIÇÃO DAS IMAGENS
        // FAZ O EMBEDDING DE CADA UM


        // Dividir o conteúdo da nota em chunks
        const chunkSize = 200;
        const chunks = await splitTextIntoChunks(note.content, chunkSize);

        // Gerar embeddings para cada chunk
        const embeddings = await generateEmbeddingsForChunks(chunks);

        // Preparar os dados dos chunks
        const chunkData = chunks.map((chunk, index) => ({
            text: chunk,
            embedding: embeddings[index],
            index
        }));

        // Após a geração dos embeddings, atualiza o status para 'completed'
        await noteRepository.updateNoteStatus(noteId, 'completed');

        // Atualizar a nota
        await noteRepository.updateNoteWithEmbeddings(noteId, chunkData);
    } catch (error) {
        console.error("Error processing embeddings:", error);
        throw error;
    }
};

export const updateNoteStatus = async (noteId: string, status: string): Promise<void> => {
    try {
        await noteRepository.updateNoteStatus(noteId, status);
    } catch (error) {
        console.error('Erro ao atualizar o status da nota:', error);
        throw error;
    }
};


// export const createNote = async (
//     title: string,
//     content: string,
//     created_by: string,
// ): Promise<INote> => {
//     try {
//         if (!title || !content) {
//             throw new Error("Title and content cannot be empty.");
//         }

//         // Dividir o conteúdo em chunks
//         const chunkSize = 200; // Número de caracteres por chunk 
//         const chunks = await splitTextIntoChunks(content, chunkSize);

//         // Gerar embeddings para cada chunk
//         const embeddings = await generateEmbeddingsForChunks(chunks);

//         // Preparar os chunks com seus embeddings e índices
//         const chunkData = chunks.map((chunk, index) => ({
//             text: chunk,
//             embedding: embeddings[index],
//             index: index
//         }));
//         // Criar a nota no repositório
//         const note = await noteRepository.createNote(
//             title,
//             content,
//             created_by
//         );
//         return note;
//     } catch (error) {
//         throw error;
//     }
// };

const generateEmbedding = async (text: string): Promise<number[]> => {
    const formattedText = text.replace(/\n/g, ' ');
    const embedding = await openAIEmbeddings.embedDocuments([formattedText]);
    return embedding[0];
};

export const searchNotesByQuery = async (query: string, matchThreshold = 0.2, matchCount = 10): Promise<INote[]> => {
    try {
        if (!query) {
            throw new Error("Query cannot be empty.");
        }

        const queryEmbedding = await generateEmbedding(query);
        const notes = await noteRepository.getNotesByEmbedding(queryEmbedding, matchThreshold, matchCount);

        if (!notes) {
            throw new Error("No notes were found for this query")
        }

        return notes;
    } catch (error: any) {
        throw new Error(`Failed to search notes: ${error.message}`);
    }
};

export const getAllNotes = async (): Promise<INote[]> => {
    try {
        const notes = await noteRepository.getAllNotes();
        return notes;
    } catch (error) {
        throw error;
    }
};

export const getNoteById = async (noteId: string, userId: string): Promise<INote> => {
    try {

        if (!userId) {
            throw new Error("User not logged in. This action is forbidden");
        }

        if (!noteId) {
            throw new Error("Note ID is required");
        }

        const note = await noteRepository.getNoteById(noteId, userId);

        if (!note) {
            throw new Error(`Note with id ${noteId} not found`);
        }

        return note;
    } catch (error) {
        throw error;
    }
};

export const deleteNote = async (noteId: string): Promise<INote> => {
    try {

        if (!noteId) {
            throw new Error("Note ID is required");
        }

        const note = await noteRepository.deleteNoteById(noteId);

        if (!note) {
            throw new Error(`Note with id ${noteId} not found`);
        }

        return note;
    } catch (error) {
        throw error;
    }
};

export const updateNote = async (
    noteId: string,
    fields: Partial<INote>,
    userId: string
): Promise<INote> => {
    const currentNote = await noteRepository.getNoteById(noteId, userId);
    if (!currentNote) {
        throw new Error("Note not found");
    }

    // Atualizar a nota com os novos campos sem modificar os chunks
    const updatedNote: INote = {
        ...currentNote,
        title: fields.title || currentNote.title,
        content: fields.content || currentNote.content,
        updated_at: new Date(),
    };

    // Atualizar a nota no repositório
    await noteRepository.updateNote(noteId, updatedNote, userId);

    return updatedNote; // Retornar a nota atualizada
};

// export const updateNote = async (
//     noteId: string,
//     fields: Partial<INote>,
//     userId: string
// ): Promise<INote> => {
//     try {
//         const currentNote = await noteRepository.getNoteById(noteId, userId);
//         if (!currentNote) {
//             throw new Error("Note not found");
//         }

//         if (fields.content && fields.content !== currentNote.content) {
//             // Dividir o novo conteúdo em chunks
//             const chunkSize = 200;
//             const newChunks = await splitTextIntoChunks(fields.content, chunkSize);

//             // Gerar embeddings para os novos chunks
//             const newEmbeddings = await generateEmbeddingsForChunks(newChunks);

//             // Preparar os chunks com seus embeddings e índices
//             const newChunkData = newChunks.map((chunk, index) => ({
//                 text: chunk,
//                 embedding: newEmbeddings[index],
//                 index: index
//             }));
//         }

//         const updatedNote: INote = {
//             ...currentNote,
//             title: fields.title || currentNote.title,
//             content: fields.content || currentNote.content,
//             updated_at: new Date(),
//         };

//         const note = await noteRepository.updateNote(noteId, updatedNote, userId);
//         return note;
//     } catch (error: any) {
//         throw new Error(`Failed to update note: ${error.message}`);
//     }
// };