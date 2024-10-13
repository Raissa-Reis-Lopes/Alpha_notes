export interface INote {
    id: number;
    title: string;
    content: string;
    embedding: number[];
    created_at: Date;
    updated_at: Date;
    created_by: string;
    updated_by: string;
}