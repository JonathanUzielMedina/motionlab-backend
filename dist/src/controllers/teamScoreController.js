"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTeamScore = exports.getTeamScoreById = void 0;
const Team_1 = require("../models/Team");
const TeamScore_1 = require("../models/TeamScore");
const StudentScore_1 = require("../models/StudentScore");
const StudentTeam_1 = require("../models/StudentTeam");
const teamStatsController_1 = require("./teamStatsController");
const Round_1 = require("../models/Round");
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
const createTeamScore = async (req, res) => {
    if (!req.body) {
        res.status(400).json({
            message: "El cuerpo de la request está vacío",
            status: "error",
            payload: null,
        });
        return;
    }
    const { results, roundId } = req.body;
    const match = await Round_1.Round.findByPk(roundId);
    if (!match) {
        return;
    }
    const matchId = await match.dataValues.id;
    try {
        const teamScores = [];
        const teamIds = [];
        for (const result of results) {
            const { team_id, time } = result;
            teamIds.push(team_id);
            const studentTeams = await StudentTeam_1.StudentTeam.findAll({
                where: { id_team: team_id },
            });
            const studentIds = studentTeams.map((st) => st.id_student);
            if (studentIds.length === 0) {
                continue;
            }
            const studentScores = await StudentScore_1.StudentScore.findAll({
                where: {
                    student_id: studentIds,
                    round_id: roundId,
                },
            });
            if (studentScores.length === 0) {
                continue;
            }
            const totalScore = studentScores.reduce((acc, score) => acc + score.score, 0);
            const averageScore = totalScore / studentScores.length;
            teamScores.push({
                team_id,
                round_id: roundId,
                score: averageScore,
                time,
                position: 0,
            });
        }
        teamScores.sort((a, b) => b.score - a.score);
        teamScores.forEach((teamScore, index) => {
            teamScore.position = index + 1;
        });
        await TeamScore_1.TeamScore.bulkCreate(teamScores);
        (0, teamStatsController_1.updateTeamStats)(teamIds, matchId);
        res.status(201).json({
            message: "Puntajes de equipos creados exitosamente.",
            status: "success",
            payload: teamScores,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Problemas en el servidor: " + error,
            status: "error",
            payload: null,
        });
    }
};
exports.createTeamScore = createTeamScore;
