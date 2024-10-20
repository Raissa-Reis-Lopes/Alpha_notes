import { IImage } from "./image";
import { IUrl } from "./url";

export interface INote {
    id: string;
    title: string;
    content: string;
    status?: string;
    images?: IImage[],
    urls?: IUrl[],
    is_in_trash?: boolean,
    is_in_archive?: boolean,
    created_at: Date;
    updated_at: Date;
    created_by: string;
}