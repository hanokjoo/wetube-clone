import express from "express";
import {
    watch,
    edit,
    upload,
    deleteVideo,
} from "../controllers/videoController";

const videoRouter = express.Router();

/* 
/:id가 /upload 보다 위에 있으면 "upload" 문자를 id값으로 받아들인다.
숫자만 입력받는 정규식을 추가하면 "upload"를 id값으로 받아들이지 않으므로 잘 동작함.
*/
videoRouter.get("/:id(\\d+)", watch);
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);
videoRouter.get("/upload", upload);

export default videoRouter;
