export interface INote {
    id: number;
    title: string;
    content: string;
    embedding: string;
    metadata?: object;
    created_at: Date;
    updated_at: Date;
    created_by: string;
    updated_by: string;
}