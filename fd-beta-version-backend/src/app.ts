import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import path from "path";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const result = dotenv.config({ path: path.join(__dirname, "../", ".env") });
if (result.error) throw result.error;

let PORT: any = process.env.PORT || 3000;

var server = app.listen(PORT, function () {
  console.log(
    "food delivery system beta version app listening on port " + PORT + "!"
  );
});

app.use("/v1", require("./v1"));

module.exports = server;
