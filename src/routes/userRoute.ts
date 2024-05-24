import express from "express";
import UserController from "../controller/userController";
import AuthMiddleWare from "../middleware/userauth";
const route = express.Router();

route.post("/signup", UserController.addUser);
route.post("/login", UserController.SignInUser);
route.get("/profile", AuthMiddleWare.auth, UserController.UserProfile);
route.put("/verify/:id", UserController.verifyUser);
route.post("/forgot", UserController.forgotPasswordEmail);
route.put("/change/:id", UserController.changePassword);

export default route;
