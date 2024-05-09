"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const leaderBoardController_1 = __importDefault(require("../controller/leaderBoardController"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/premiumfeature", leaderBoardController_1.default.getLeaderBoard);
exports.default = router;
