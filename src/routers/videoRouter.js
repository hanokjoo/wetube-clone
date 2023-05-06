import express from "express";
import {
    watch,
    getEdit,
    postEdit,
    getUpload,
    postUpload,
    getDelete,
} from "../controllers/videoController";
import { protectorMiddleware, videoUpload } from "../middleware";

const videoRouter = express.Router();

/* 
/:id가 /upload 보다 위에 있으면 "upload" 문자를 id값으로 받아들인다.
숫자만 입력받는 정규식을 추가하면 "upload"를 id값으로 받아들이지 않으므로 잘 동작함.
*/
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter
    .route("/:id([0-9a-f]{24})/edit")
    .all(protectorMiddleware)
    .get(getEdit)
    .post(postEdit);
videoRouter
    .route("/:id([0-9a-f]{24})/delete")
    .all(protectorMiddleware)
    .get(getDelete);
videoRouter
    .route("/upload")
    .all(protectorMiddleware)
    .get(getUpload)
    .post(videoUpload.single("video"), postUpload);

export default videoRouter;
