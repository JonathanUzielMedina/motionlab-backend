"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeamScoresByRound = exports.createTeamScore = exports.getAllTeamScores = exports.getTeamScoreById = void 0;
const Team_1 = require("../models/Team");
const TeamScore_1 = require("../models/TeamScore");
const StudentScore_1 = require("../models/StudentScore");
const StudentTeam_1 = require("../models/StudentTeam");
const teamStatsController_1 = require("./teamStatsController");
const Student_1 = require("../models/Student");
const Match_1 = require("../models/Match");
const Round_1 = require("../models/Round");
const getTeamScoreById = async (req, res) => {
    try {
        const id = req.params.id;
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
const getAllTeamScores = async (req, res) => {
    try {
        const rawScores = await TeamScore_1.TeamScore.findAll({
            order: [["score", "DESC"]],
        });
        const scores = rawScores.map((score) => ({
            id: score.dataValues.team_id,
            time: score.dataValues.time,
            score: score.dataValues.score,
        }));
        res.status(200).json({
            message: "Puntajes de los alumnos obtenidos correctamente",
            status: "success",
            payload: scores,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Problemas en el servidor " + error,
            status: "Error",
            payload: null,
        });
    }
};
exports.getAllTeamScores = getAllTeamScores;
const createTeamScore = async (req, res) => {
    if (!req.body) {
        res.status(400).json({
            message: "El body estaba vacio",
            status: "error",
            payload: null,
        });
        return;
    }
    const { results, roundId } = req.body;
    const round = await Round_1.Round.findByPk(roundId, {
        include: [
            {
                model: Match_1.Match,
            },
        ],
    });
    if (!round) {
        res.status(404).json({
            message: "Round no encontrado",
            status: "error",
            payload: null,
        });
        return;
    }
    const matchId = round.dataValues.match_id;
    try {
        const studentScores = await StudentScore_1.StudentScore.findAll({
            where: {
                round_id: roundId,
            },
            include: [
                {
                    model: Student_1.Student,
                    required: true,
                    include: [
                        {
                            model: StudentTeam_1.StudentTeam,
                            where: { id_team: results.team_id },
                            required: true,
                        },
                    ],
                },
            ],
        });
        if (studentScores.length === 0) {
            res.status(400).json({
                message: "No se encontraron puntajes de estudiantes para este equipo",
                status: "error",
                payload: null,
            });
            return;
        }
        const totalScores = studentScores.length;
        const totalScore = studentScores.reduce((sum, score) => {
            const value = score.dataValues.score || 0;
            return sum + value;
        }, 0);
        const teamScore = Math.ceil(totalScore / totalScores);
        const time = results.time !== undefined && !isNaN(results.time) ? results.time : 0;
        const score = {
            team_id: results.team_id,
            round_id: roundId,
            score: teamScore,
            time: time,
            position: 0,
        };
        await TeamScore_1.TeamScore.create(score);
        const allScores = await TeamScore_1.TeamScore.findAll({
            where: {
                round_id: roundId,
            },
        });
        const sortedScores = [...allScores].sort((a, b) => {
            const scoreA = a.dataValues?.score || 0;
            const scoreB = b.dataValues?.score || 0;
            return scoreB - scoreA;
        });
        for (let i = 0; i < sortedScores.length; i++) {
            await TeamScore_1.TeamScore.update({ position: i + 1 }, {
                where: {
                    id: sortedScores[i].dataValues.id,
                },
            });
        }
        try {
            await (0, teamStatsController_1.updateTeamStats)(results.team_id, matchId);
        }
        catch (statsError) {
            console.error("Error updating team stats, but score was created:", statsError);
        }
        res.status(201).json({
            message: "Puntajes de equipos creados exitosamente.",
            status: "success",
            payload: null,
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
const getTeamScoresByRound = async (req, res) => {
    try {
        const teamScores = await TeamScore_1.TeamScore.findAll({
            where: {
                round_id: req.params.id,
            },
        });
        res.status(200).json({
            message: "Scores de los equipos obtenidos correctamente",
            status: "success",
            payload: teamScores,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Problema interno del servidor " + error,
            status: "error",
            payload: null,
        });
    }
};
exports.getTeamScoresByRound = getTeamScoresByRound;
