const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");

require('dotenv').config();
const PORT = process.env.PORT || 4000;

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());
app.use(cors());
app.use(helmet());

require("./config/database").connect();

//route import and mount
const user = require("./routes/user");
const task = require("./routes/task");
app.use("/api/v1", user);
app.use("/api/v2", task);

//actuivate

app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
})