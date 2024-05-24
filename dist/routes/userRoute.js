"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controller/userController"));
const userauth_1 = __importDefault(require("../middleware/userauth"));
const route = express_1.default.Router();
route.post("/signup", userController_1.default.addUser);
route.post("/login", userController_1.default.SignInUser);
route.get("/profile", userauth_1.default.auth, userController_1.default.UserProfile);
route.put("/verify/:id", userController_1.default.verifyUser);
route.post("/forgot", userController_1.default.forgotPasswordEmail);
route.put("/change/:id", userController_1.default.changePassword);
exports.default = route;
