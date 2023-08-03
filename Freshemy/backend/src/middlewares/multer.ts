import { RequestHasLogin } from "../types/request.type";
import { uploadFile, uploadVideo } from "../configs/multer.config";
import { Response, NextFunction } from "express";
import { MulterError } from "multer";

export const uploadVideoMdw = async (req: RequestHasLogin, res: Response, next: NextFunction) => {
    uploadVideo(req, res, (error: any) => {
        if (error instanceof MulterError) {
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        } else if (error) {
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        }
        next();
    });
};

export const uploadFileMdw = async (req: RequestHasLogin, res: Response, next: NextFunction) => {
    uploadFile(req, res, (error: any) => {
        if (error instanceof MulterError) {
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        } else if (error) {
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        }
        next();
    });
};
