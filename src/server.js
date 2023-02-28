import express from "express";

const PORT = 4000;

const app = express();

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};
const privateMiddleware = (req, res, next) => {
    const url = req.url;
    if (url === "/protected") {
        return res.send("<h1>Not Allowed</h1>");
    }
    console.log("Allowed, you may continue.");
    next();
};

const handleHome = (req, res) => {
    return res.send("<h1>Don't think. Just do!</h1>");
};
const handleProtected = (req, res) => {
    return res.sed("<h1>Welcome to the Private rounge.</h1>");
};

app.use(logger);
app.use(privateMiddleware);
app.get("/", handleHome);
app.get("/protected", handleProtected);
/* privateMiddleware에서 res.send()로 끝나서 handleProtected는 호출되지 않음 */

const handleListening = () =>
    console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
