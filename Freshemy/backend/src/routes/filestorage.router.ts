import { Router } from "express";
import controllers from "../controllers";
import { isLogin } from "../middlewares/isLogin";
import { uploadFileMdw } from "../middlewares/multer";

const fileStorageRouter: Router = Router();

fileStorageRouter.post("/", isLogin, uploadFileMdw, controllers.fileStorageController.uploadImageToCloudinary);

export default fileStorageRouter;
