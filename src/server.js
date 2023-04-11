import express from "express";
import morgan from "morgan";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: "Hello!",
        resave: true,
        saveUninitialized: true,
    })
);

/*  express-session 설치 후 session 확인해보기 
    1. 브라우저가 서버에 요청하면 session id를 보낸다.
    2. 브라우저는 받은 id를 cookie에 저장한다.
    3. 브라우저는 모든 url에 요청을 보낼 때 마다 session id를 같이 보낸다.
    4. 서버에서 어떤 유저 or 어떤 브라우저가 요청했는지 알 수 있다.
*/
app.use((req, res, next) => {
    req.sessionStore.all((error, sessions) => {
        console.log(sessions);
        next();
    });
});
app.get("/add-one", (req, res, next) => {
    req.session.potatoCounter += 1;
    return res.send(`${req.session.id}\n${req.session.potatoCounter}`);
});

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
