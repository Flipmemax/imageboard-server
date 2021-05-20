const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const jsonParser = express.json();
const userRouter = require("./routers/user");
const imageRouter = require("./routers/image");
const authRouter = require("./routers/auth");
const authMiddleware = require("./auth/middleware");

//parses body to json format
app.use(jsonParser);

//routers:
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/images", authMiddleware, imageRouter);

app.listen(port, () => console.log(`Listening on :${port}`));
