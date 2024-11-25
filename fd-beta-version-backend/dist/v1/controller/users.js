"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupSchema = signupSchema;
exports.loginSchema = loginSchema;
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const filefunctions_1 = require("../library/filefunctions");
const functions_1 = require("../library/functions");
const validations_1 = require("../library/validations");
const dbusers_1 = require("../model/dbusers");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function signupSchema(req, res, next) {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(3).required(),
        email: joi_1.default.string().email().lowercase().required(),
        password: joi_1.default.string().min(2).required(),
        phone: joi_1.default.string().required(),
        usertype: joi_1.default.string().required(),
    });
    const validationsObj = new validations_1.validations();
    const isValid = validationsObj.validateRequest(req, res, next, schema);
    if (!isValid) {
        return false;
    }
    next();
}
function loginSchema(req, res, next) {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().lowercase().required(),
        password: joi_1.default.string().min(2).required(),
    });
    const validationsObj = new validations_1.validations();
    const isValid = validationsObj.validateRequest(req, res, next, schema);
    if (!isValid) {
        return false;
    }
    next();
}
const router = express_1.default.Router();
router.post("/signup", signupSchema, signup);
router.post("/login", loginSchema, login);
module.exports = router;
// async function list(req: any, res: any) {
//     let productsObj = new dbproducts();
//     let seller_id = req.body.seller_id;
//     let result: any = await productsObj.getProducts(seller_id);
//     var functionsObj = new functions();
//     res.send(functionsObj.output(1, 'SUCCESS', result));
//     return false;
// }
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var functionsObj = new functions_1.functions();
        try {
            const { name, email, phone, password, usertype } = req.body;
            var filefunctionsObj = new filefunctions_1.filefunctions();
            let user_password = password;
            const hashedPassword = yield filefunctionsObj.hashPassword(user_password);
            let user_email = email;
            let usersObj = new dbusers_1.dbusers();
            const existingUser = yield usersObj.getUserByEmail(user_email);
            if (existingUser) {
                res.send(functionsObj.output(0, "User with this email aldready exists"));
            }
            const result = yield usersObj.insertUser(Object.assign(Object.assign({}, req.body), { password: hashedPassword }));
            res.send(functionsObj.output(1, "User successfully registered", result));
        }
        catch (err) {
            res.send(functionsObj.output(0, err));
        }
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        var functionsObj = new functions_1.functions();
        try {
            var filefunctionsObj = new filefunctions_1.filefunctions();
            let user_email = email;
            let usersObj = new dbusers_1.dbusers();
            const user = yield usersObj.getUserByEmail(user_email);
            if (!user) {
                res.send(functionsObj.output(0, "Invalid credentials"));
            }
            let user_password = password;
            const passwordMatch = yield filefunctionsObj.comparePassword(user_password, user.password);
            if (!passwordMatch) {
                res.send(functionsObj.output(0, "Email is valid but incorrect password"));
            }
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                userType: user.usertype,
            }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });
            user.password = undefined;
            let data = {
                token: token,
            };
            res.send(functionsObj.output(1, "user logged in successfully", data));
        }
        catch (error) {
            console.log(error);
            res.send(functionsObj.output(0, "Internal Server Error"));
        }
    });
}
