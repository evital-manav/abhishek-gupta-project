"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
const result = dotenv_1.default.config({ path: path_1.default.join(__dirname, "../", ".env") });
if (result.error)
    throw result.error;
let PORT = process.env.PORT || 3000;
var server = app.listen(PORT, function () {
    console.log("food delivery system beta version app listening on port " + PORT + "!");
});
app.use("/v1", require("./v1"));
module.exports = server;
