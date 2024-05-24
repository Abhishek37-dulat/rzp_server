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
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Sib = require("sib-api-v3-sdk");
class UserController {
    static addUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, } = req.body;
                const existingUser = yield User_1.User.findOne({
                    where: { email },
                });
                if (existingUser) {
                    res.status(400).json({ error: "User already exists" });
                    return;
                }
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                const newUser = yield User_1.User.create({
                    name,
                    email,
                    password: hashedPassword,
                    isPremium: false,
                    isVerified: false,
                });
                const client = yield Sib.ApiClient.instance;
                const apiKey = yield client.authentications["api-key"];
                apiKey.apiKey = process.env.SENDBLUE;
                const tranEmailApi = new Sib.TransactionalEmailsApi();
                const sender = {
                    email: "sendmailm6@gmail.com",
                    name: "Abhishek",
                };
                const receivers = [{ email: email }];
                tranEmailApi.sendTransacEmail({
                    sender,
                    to: receivers,
                    subject: "Verify Userself",
                    htmlContent: `<p>Verify yourself: <a href="http://localhost:3000/user/verify/${newUser.id}">Verify yourself</a></p>`,
                });
                // console.log(tranEmailApi);
                res
                    .status(201)
                    .json({ message: "User created successfully", data: newUser });
            }
            catch (error) {
                console.error("Error while adding user:", error);
                res.status(500).json({ error: "Server error" });
            }
        });
    }
    static SignInUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield User_1.User.findOne({ where: { email } });
                if (!user) {
                    res.status(404).json({ error: "User not found" });
                    return;
                }
                const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    res.status(401).json({ error: "Incrrect password" });
                    return;
                }
                const token = jsonwebtoken_1.default.sign({
                    name: user.name,
                    id: user.id,
                    isPremium: user.isPremium,
                    isVerified: user.isVerified,
                    totalCost: user.totalCost,
                    email: user.email,
                }, process.env.TOKEN_SECRET);
                res.status(201).json({ message: "Login Successful", data: token });
            }
            catch (error) {
                console.error("Error while signing in: ", error);
                res.status(500).json({ error: "Server error" });
            }
        });
    }
    static UserProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.User.findOne({
                    where: { email: req.user.email },
                    attributes: { exclude: ["password"] },
                });
                console.log(user);
                res.status(201).json({ message: "Profile Data Successful", data: user });
            }
            catch (error) {
                console.error("Error in Profile: ", error);
                res.status(500).json({ error: "Server error" });
            }
        });
    }
    static verifyUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("PARAMS::: ", req.params.id);
                const userExist = yield User_1.User.findByPk(req.params.id);
                if (!userExist) {
                    res.status(403).json({ message: "User don't exist" });
                    return;
                }
                yield userExist.update({
                    isVerified: true,
                });
                res.status(200).json({ message: "User Verification Sccessful" });
            }
            catch (error) {
                console.error("Error while verifing User");
                res.status(500).json({ message: "Server Error" });
            }
        });
    }
    static forgotPasswordEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const userExist = yield User_1.User.findOne({ where: { email: email } });
                if (!userExist) {
                    res.status(403).json({ message: "User don't exist" });
                    return;
                }
                const client = yield Sib.ApiClient.instance;
                const apiKey = yield client.authentications["api-key"];
                apiKey.apiKey = process.env.SENDBLUE;
                const tranEmailApi = new Sib.TransactionalEmailsApi();
                const sender = {
                    email: "sendmailm6@gmail.com",
                    name: "Abhishek",
                };
                const receivers = [{ email: email }];
                tranEmailApi.sendTransacEmail({
                    sender,
                    to: receivers,
                    subject: "Update Password",
                    htmlContent: `<p>Update Password: <a href="C:\Users\Abhishek Dulat\Downloads\sharpner_exp\client\newpage.html">update</a></p>`,
                });
                res.status(200).json({ message: "Update Password request" });
            }
            catch (error) {
                console.error("Error while password req");
                res.status(500).json({ message: "Server Error" });
            }
        });
    }
    static changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password } = req.body;
                const userExist = yield User_1.User.findByPk(req.params.id);
                if (!userExist) {
                    res.status(403).json({ message: "User don't exist" });
                    return;
                }
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                yield userExist.update({
                    password: hashedPassword,
                });
                res.status(200).json({ message: "Password Changed Successfully" });
            }
            catch (error) {
                console.error("Error while password change");
                res.status(500).json({ message: "Server Error" });
            }
        });
    }
}
exports.default = UserController;
