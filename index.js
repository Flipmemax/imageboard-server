const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const jsonParser = express.json();
const userRouter = require("./routers/user");
const imageRouter = require("./routers/image");

//parses body to json format
app.use(jsonParser);

//routers:
app.use("/users", userRouter);
app.use("/images", imageRouter);

app.listen(port, () => console.log(`Listening on :${port}`));
