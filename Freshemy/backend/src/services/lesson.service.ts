import { Request } from "express";
import configs from "../configs";
import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import jwt, { JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken";
import { RequestHasLogin } from "../types/request.type";
import services from ".";
import { resolutions } from "../commons";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import i18n from "../utils/i18next";

const getLesson = async (req: Request): Promise<ResponseBase> => {
    try {
        const { id } = req.params;
        const lesson_id = +id;
        const isFoundLesson = await configs.db.lesson.findFirst({
            where: {
                id: lesson_id,
                is_delete: false,
            },
        });
        const data = {
            id: isFoundLesson?.id,
            url_video: isFoundLesson?.url_video,
        };
        if (isFoundLesson) return new ResponseSuccess(200, i18n.t("successMessages.getDataSuccess"), true, data);
        return new ResponseError(400, i18n.t("errorMessages.validationFailed"), false);
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false);
        }
        if (error instanceof TokenExpiredError) {
            return new ResponseError(400, error.message, false);
        } else if (error instanceof JsonWebTokenError) {
            return new ResponseError(401, error.message, false);
        } else if (error instanceof NotBeforeError) {
            return new ResponseError(401, error.message, false);
        }

        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
    }
};

const createLesson = async (req: RequestHasLogin): Promise<ResponseBase> => {
    try {
        const { title, section_id } = req.body;

        const sectionIdConvert = parseInt(section_id);
        const uuid = uuidv4();

        const videoPath = await services.FileStorageService.createFileM3U8AndTS(
            req.file as Express.Multer.File,
            resolutions,
            configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS,
            uuid,
        );

        const lesson = await configs.db.lesson.create({
            data: {
                title: title,
                section_id: sectionIdConvert,
                url_video: videoPath,
            },
        });
        if (lesson) {
            return new ResponseSuccess(200, i18n.t("successMessages.createDataSuccess"), true);
        } else {
            fs.unlinkSync(path.join(configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS, uuid));
            fs.unlinkSync(req.file?.path as string);
        }
        return new ResponseError(400, i18n.t("errorMessages.validationFailed"), false);
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false);
        }
        if (error instanceof TokenExpiredError) {
            return new ResponseError(400, error.message, false);
        } else if (error instanceof JsonWebTokenError) {
            return new ResponseError(401, error.message, false);
        } else if (error instanceof NotBeforeError) {
            return new ResponseError(401, error.message, false);
        }

        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
    }
};

const updateLesson = async (req: Request): Promise<ResponseBase> => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const lesson_id = +id;
        if (req.file) {
            const isFoundLesson = await configs.db.lesson.findUnique({
                where: {
                    id: lesson_id,
                },
            });

            if (!isFoundLesson) {
                return new ResponseError(400, i18n.t("errorMessages.validationFailed"), false);
            }

            const urlVideoSplit = isFoundLesson.url_video.split(`${configs.general.PUBLIC_URL_FOLDER_VIDEOS}`);
            const nameFolder = urlVideoSplit[1].split("/")[1];
            if (!nameFolder) {
                return new ResponseError(400, i18n.t("errorMessages.validationFailed"), false);
            }
            fs.unlinkSync(path.join(configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS, nameFolder));

            const videoPath = await services.FileStorageService.createFileM3U8AndTS(
                req.file as Express.Multer.File,
                resolutions,
                configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS,
                nameFolder,
            );

            const lesson = await configs.db.lesson.update({
                where: {
                    id: lesson_id,
                },
                data: {
                    title: title,
                    url_video: videoPath,
                },
            });

            if (lesson) {
                return new ResponseSuccess(200, i18n.t("successMessages.createDataSuccess"), true);
            } else {
                fs.unlinkSync(path.join(configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS, nameFolder));
                fs.unlinkSync(req.file?.path as string);
            }
        } else {
            const lesson = await configs.db.lesson.update({
                where: {
                    id: lesson_id,
                },
                data: {
                    title: title,
                },
            });
            if (lesson) return new ResponseSuccess(200, i18n.t("successMessages.updateDataSuccess"), true);
        }
        return new ResponseError(400, i18n.t("errorMessages.validationFailed"), false);
    } catch (error: any) {
        fs.unlinkSync(req.file?.path as string);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false);
        }
        if (error instanceof TokenExpiredError) {
            return new ResponseError(400, error.message, false);
        } else if (error instanceof JsonWebTokenError) {
            return new ResponseError(401, error.message, false);
        } else if (error instanceof NotBeforeError) {
            return new ResponseError(401, error.message, false);
        }

        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
    }
};

const deleteLesson = async (req: Request): Promise<ResponseBase> => {
    try {
        const { id } = req.params;
        const lesson_id = +id;
        const isDelete = await configs.db.lesson.update({
            where: {
                id: lesson_id,
            },
            data: {
                is_delete: true,
            },
        });
        if (isDelete) return new ResponseSuccess(200, i18n.t("successMessages.deleteDataSuccess"), true);
        return new ResponseError(400, i18n.t("errorMessages.validationFailed"), false);
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false);
        }
        if (error instanceof TokenExpiredError) {
            return new ResponseError(400, error.message, false);
        } else if (error instanceof JsonWebTokenError) {
            return new ResponseError(401, error.message, false);
        } else if (error instanceof NotBeforeError) {
            return new ResponseError(401, error.message, false);
        }

        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
    }
};
const LessonService = {
    getLesson,
    createLesson,
    updateLesson,
    deleteLesson,
};
export default LessonService;
