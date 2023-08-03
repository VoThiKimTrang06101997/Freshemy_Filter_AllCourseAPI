import authRouter from "./auth.router";
import userRouter from "./user.router";
import sectionRouter from "./section.router";
import categoryRouter from "./category.router";
import courseRouter from "./course.router";
import lessonRouter from "./lesson.router";
import fileStorageRouter from "./filestorage.router";

const routers = {
    authRouter: authRouter,
    userRouter: userRouter,
    courseRouter: courseRouter,
    sectionRouter: sectionRouter,
    lessonRouter: lessonRouter,
    categoryRouter: categoryRouter,
    fileStorageRouter: fileStorageRouter,
};

export default routers;
