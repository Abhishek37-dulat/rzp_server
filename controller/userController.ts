import { User } from "../models/User";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const Sib: any = require("sib-api-v3-sdk");

interface UserData {
  id: number;
  name: string;
  email: string;
  password: string;
  isPremium: boolean;
  totalCost: number;
  isVerified: boolean;
}

class UserController {
  static async addUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        name,
        email,
        password,
      }: { name: string; email: string; password: string } = req.body;
      const existingUser: UserData | null = await User.findOne({
        where: { email },
      });

      if (existingUser) {
        res.status(400).json({ error: "User already exists" });
        return;
      }

      const hashedPassword: string = await bcrypt.hash(password, 10);
      const newUser: UserData = await User.create({
        name,
        email,
        password: hashedPassword,
        isPremium: false,
        isVerified: false,
      } as UserData);
      const client: any = await Sib.ApiClient.instance;
      const apiKey: any = await client.authentications["api-key"];
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
        htmlContent: `<p>Verify yourself: <a href="-http://localhost:3000/user/verify/:${newUser.id}">Verify yourself</a></p>`,
      });

      res
        .status(201)
        .json({ message: "User created successfully", data: newUser });
    } catch (error) {
      console.error("Error while adding user:", error);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async SignInUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password }: { email: string; password: string } = req.body;

      const user: UserData | null = await User.findOne({ where: { email } });
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const isPasswordValid: boolean = await bcrypt.compare(
        password,
        user.password
      );
      if (!isPasswordValid) {
        res.status(401).json({ error: "Incrrect password" });
        return;
      }
      const token: string = jwt.sign(
        {
          name: user.name,
          id: user.id,
          isPremium: user.isPremium,
          isVerified: user.isVerified,
          totalCost: user.totalCost,
          email: user.email,
        },
        process.env.TOKEN_SECRET as string
      );
      res.status(201).json({ message: "Login Successful", data: token });
    } catch (error) {
      console.error("Error while signing in: ", error);
      res.status(500).json({ error: "Server error" });
    }
  }
  static async verifyUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("PARAMS::: ", req.params.id);
      const userExist = await User.findByPk(req.params.id);
      if (!userExist) {
        res.status(403).json({ message: "User don't exist" });
        return;
      }
      await userExist.update({
        isVerified: true,
      } as UserData);
      res.status(200).json({ message: "User Verification Sccessful" });
    } catch (error) {
      console.error("Error while verifing User");
      res.status(500).json({ message: "Server Error" });
    }
  }
  static async forgotPasswordEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email }: { email: string } = req.body;
      const userExist = await User.findOne({ where: { email: email } });
      if (!userExist) {
        res.status(403).json({ message: "User don't exist" });
        return;
      }
      const client = await Sib.ApiClient.instance;
      const apiKey = await client.authentications["api-key"];
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
    } catch (error) {
      console.error("Error while password req");
      res.status(500).json({ message: "Server Error" });
    }
  }
  static async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { password }: { password: string } = req.body;
      const userExist = await User.findByPk(req.params.id);
      if (!userExist) {
        res.status(403).json({ message: "User don't exist" });
        return;
      }
      const hashedPassword: string = await bcrypt.hash(password, 10);
      await userExist.update({
        password: hashedPassword,
      } as UserData);
      res.status(200).json({ message: "Password Changed Successfully" });
    } catch (error) {
      console.error("Error while password change");
      res.status(500).json({ message: "Server Error" });
    }
  }
}

export default UserController;
