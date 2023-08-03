import { Request, Response } from "express";
import { ValidationError } from "joi";
import { convertJoiErrorToString } from "../commons/index";
import service from "../services/index";
import { SectionSchema, UpdateSectionSchema } from "../validations/section";

class SectionController {
    async getAllSectionByCourseId(req: Request, res: Response): Promise<Response> {
        const response = await service.SectionService.getAllSectionByCourseId(req);

        return res.status(response.getStatusCode()).json(response);
    }

    async createSection(req: Request, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = SectionSchema.validate(req.body).error;

        if (errorValidate) {
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }

        const response = await service.SectionService.createSection(req);

        return res.status(response.getStatusCode()).json(response);
    }

    async updateSection(req: Request, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = UpdateSectionSchema.validate(req.body).error;

        if (errorValidate) {
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }

        const response = await service.SectionService.updateSection(req);

        return res.status(response.getStatusCode()).json(response);
    }

    async deleteSection(req: Request, res: Response): Promise<Response> {
        const response = await service.SectionService.deleteSection(req);

        return res.status(response.getStatusCode()).json(response);
    }
}

export default SectionController;
