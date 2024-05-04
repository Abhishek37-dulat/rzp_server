import LeaderBoardController from "../controller/leaderBoardController";
import express from "express";

const router = express.Router();

router.get("/premiumfeature", LeaderBoardController.getLeaderBoard);

export default router;
