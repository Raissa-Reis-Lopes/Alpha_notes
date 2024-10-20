import { IImage } from "./image";
import { IUrl } from "./url";

export interface INote {
    id: string;
    title: string;
    content: string;
    status?: string;
    images?: IImage[],
    urls?: IUrl[],
    created_at: Date;
    updated_at: Date;
    created_by: string;
}