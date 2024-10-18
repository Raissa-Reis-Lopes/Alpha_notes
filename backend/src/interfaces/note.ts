export interface INote {
    id: string;
    title: string;
    content: string;
    metadata?: object;
    created_at: Date;
    updated_at: Date;
    created_by: string;
}