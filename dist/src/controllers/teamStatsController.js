"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTeamStat = exports.getAllTeamStats = void 0;
const TeamStats_1 = require("../models/TeamStats");
const TeamScore_1 = require("../models/TeamScore");
//obetener estadisticas de todos los equipos
const getAllTeamStats = async (req, res) => {
    try {
        const data = await TeamStats_1.TeamStats.findAll();
        res.status(200).json({
            status: "success",
            message: "Estadisticas del equipo fueron recuperadas correctamente.",
            payload: data,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: "Hubo un problema en el servidor.",
            payload: null,
        });
    }
};
exports.getAllTeamStats = getAllTeamStats;
//crear score de un equipo y actualizar estadisticas con promedios
const createTeamStat = async (req, res) => {
    try {
        const { team_id, round_id, position, time, score } = req.body;
        // Crear el nuevo registro de score
        const newTeamScore = await TeamScore_1.TeamScore.create({
            team_id,
            round_id,
            position,
            time,
            score
        });
        const teamScores = await TeamScore_1.TeamScore.findAll({
            where: {
                team_id
            }
        });
        // Calcular nuevos promedios
        const played_rounds = teamScores.length;
        let total_time = 0;
        let total_position = 0;
        teamScores.forEach(teamScore => {
            total_time += teamScore.time;
            total_position += teamScore.position;
        });
        const average_time = total_time / played_rounds;
        const average_position = total_position / played_rounds;
        // Actualizar las estadísticas del equipo
        const teamStats = await TeamStats_1.TeamStats.findOne({
            where: {
                team_id
            }
        });
        if (teamStats) {
            await teamStats.update({
                played_rounds,
                average_time,
                average_position
            });
        }
        else {
            await TeamStats_1.TeamStats.create({
                team_id,
                played_rounds,
                average_time,
                average_position
            });
        }
        res.status(201).json({
            status: "success",
            message: "Score registrado y estadísticas actualizadas correctamente.",
            payload: newTeamScore,
        });
    }
    catch (error) {
        console.error("Error al registrar score:", error);
        res.status(500).json({
            status: "error",
            message: "Hubo un problema en el servidor.",
            payload: null,
        });
    }
};
exports.createTeamStat = createTeamStat;
