import mongoose from "mongoose";

//mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

const db = mongoose.connection;
const handleOpen = () => console.log("✅ Connectied to DB");
const handleError = (error) => console.log("❌ DB Error", error);
db.on("error", handleError);
db.once("open", handleOpen);
