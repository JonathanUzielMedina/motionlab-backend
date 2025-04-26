"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeamScoreById = void 0;
const Team_1 = require("../models/Team");
const TeamScore_1 = require("../models/TeamScore");
const getTeamScoreById = async (req, res) => {
    try {
        const { id } = req.params;
        const rawData = await TeamScore_1.TeamScore.findAll({
            include: [
                {
                    model: Team_1.Team,
                },
            ],
            where: {
                round_id: id,
            },
        });
        const data = rawData.map((element) => ({
            teamId: element.team.id,
            position: element.position,
            time: element.time,
            score: element.score,
        }));
        res.status(200).json({
            message: "Score obtenidos exitosamente",
            payload: data,
            status: "success",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Hubo un problema en el servidor",
            payload: null,
            status: "error",
        });
    }
};
exports.getTeamScoreById = getTeamScoreById;
