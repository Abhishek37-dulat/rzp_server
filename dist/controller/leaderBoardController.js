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
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
class LeaderBoardController {
    static getLeaderBoard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const leaderBoardOfUsers = yield User_1.User.findAll({
                    attributes: ["id", "name", "totalCost"],
                    order: ["totalCost"],
                });
                res.status(200).json({ data: leaderBoardOfUsers });
            }
            catch (error) {
                console.error("Error while fetching LeaderBoard", error);
                res.status(500).json({ message: "Server Error" });
            }
        });
    }
}
exports.default = LeaderBoardController;
