import { Request, Response, NextFunction } from "express";
import Razorpay from "razorpay";
import { Order } from "../models/Order";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface OrderData {
  id: number;
  paymentId: string;
  orderId: string;
  status: string;
  userId: number;
}

class PaymentController {
  static async purchase(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log(req.user);
      let rzp: any = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
      });
      const amount: number = 2500;
      await rzp.orders.create(
        { amount, currency: "INR" },
        async (err: any, order: any) => {
          if (err) {
            throw new Error(JSON.stringify(err));
          }

          const orderdata = await req.user.createOrder({
            orderId: order.id,
            status: "PENDING",
          });
          res.status(201).json({ order, key_id: rzp.key_id });
        }
      );
    } catch (error) {
      console.error("Error while purchase", error);
      res.status(403).json({ message: "Server error", error });
    }
  }
  static async updatePurchase(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { payment_id, order_id }: { payment_id: string; order_id: string } =
        req.body;
      const order = await Order.findOne({ where: { orderId: order_id } });
      const updatedOrder: OrderData = await order!.update({
        paymentId: payment_id,
        status: "SUCCESSFUL",
      } as OrderData);
      const data = await req.user.update({ isPremium: true });
      const token = await JWT.sign(
        {
          name: data.name,
          id: data.id,
          isPremium: data.isPremium,
          isVerified: data.isVerified,
        },
        process.env.TOKEN_SECRET as string
      );
      res.status(202).json({
        sucess: true,
        message: "Transaction Successful",
        token: token,
      });
    } catch (error) {
      console.error("Error while updating purchase", error);
      res.status(403).json({ error: error, message: "Somethingwent wrong" });
    }
  }
  static async updatePurchaseFailed(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { payment_id, order_id }: { payment_id: string; order_id: string } =
        req.body;
      const order = await Order.findOne({ where: { orderId: order_id } });
      const updatedOrder: OrderData = await order!.update({
        paymentId: payment_id,
        status: "FAILED",
      } as OrderData);
      const data = await req.user.update({ isPremium: false });
      const token = await JWT.sign(
        {
          name: data.name,
          id: data.id,
          isPremium: data.isPremium,
          isVerified: data.isVerified,
        },
        process.env.TOKEN_SECRET as string
      );
      res.status(202).json({
        sucess: true,
        message: "Transaction Successful",
        token: token,
      });
    } catch (error) {
      console.error("Error while purchase Failed", error);
      res.status(403).json({ message: "Server error", error });
    }
  }
}

export default PaymentController;
