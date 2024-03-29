import express from "express";
import {
    getEdit,
    postEdit,
    logout,
    see,
    startGithubLogin,
    finishGithubLogin,
    getChangePassword,
    postChagePassword,
} from "../controllers/userController";
import {
    protectorMiddleware,
    publicOnlyMiddleware,
    avatarUpload,
} from "../middleware";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter
    .route("/edit")
    .all(protectorMiddleware)
    .get(getEdit)
    .post(avatarUpload.single("avatar"), postEdit);
userRouter
    .route("/change-password")
    .all(protectorMiddleware)
    .get(getChangePassword)
    .post(postChagePassword);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id([0-9a-f]{24})", see);

export default userRouter;
