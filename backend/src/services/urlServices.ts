import * as urlRepository from "../repositories/urlRepository";
import { getVideoInfo } from "../utils/getVideoTitleAndThumb";

export const saveUrl = async (url: string) => {
    try {
        if (!url) {
            throw new Error("URL não pode estar vazia.");
        }

        const newUrl = await urlRepository.saveUrl(url);
        return newUrl;
    } catch (error: any) {
        throw error;
    }
};

export const deleteUrl = async (urlId: string) => {
    try {
        if (!urlId) {
            throw new Error("URLId can not be empty");
        }

        const url = await urlRepository.getUrlById(urlId);

        if (!url) {
            throw new Error(`URL with id ${urlId} not found`);
        }

        await urlRepository.deleteUrlById(urlId);
    } catch (error: any) {
        throw error;
    }
};