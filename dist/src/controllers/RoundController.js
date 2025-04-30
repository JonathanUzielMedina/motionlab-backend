"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMostRecentRound = exports.createRound = exports.getRoundById = exports.getAllRounds = void 0;
const Round_1 = require("../models/Round");
const TeamScore_1 = require("../models/TeamScore");
const StudentScore_1 = require("../models/StudentScore");
const getAllRounds = async (req, res) => {
    try {
        const rounds = await Round_1.Round.findAll({
            include: [
                {
                    model: TeamScore_1.TeamScore,
                    as: "team_scores",
                },
                {
                    model: StudentScore_1.StudentScore,
                    as: "student_scores",
                },
            ],
        });
        res.status(200).json({
            message: "Rondas obtenidas exitosamente",
            payload: rounds,
            status: "success",
        });
    }
    catch (error) {
        console.error("Error al obtener las rondas:", error);
        res.status(500).json({
            message: "Error en el servidor",
            payload: null,
            status: "error",
        });
    }
};
exports.getAllRounds = getAllRounds;
const getRoundById = async (req, res) => {
    try {
        const { id } = req.params;
        const round = await Round_1.Round.findByPk(id, {
            include: [
                {
                    model: TeamScore_1.TeamScore,
                    as: "team_scores",
                },
                {
                    model: StudentScore_1.StudentScore,
                    as: "student_scores",
                },
            ],
        });
        if (!round) {
            res.status(404).json({
                message: "Ronda no encontrada",
                payload: null,
                status: "error",
            });
            return;
        }
        res.status(200).json({
            message: "Ronda obtenida exitosamente",
            payload: round,
            status: "success",
        });
    }
    catch (error) {
        console.error("Error al obtener la ronda:", error);
        res.status(500).json({
            message: "Error en el servidor",
            payload: null,
            status: "error",
        });
    }
};
exports.getRoundById = getRoundById;
const createRound = async (req, res) => {
    try {
        const { match_id } = req.body;
        const newRound = await Round_1.Round.create({ match_id });
        res.status(201).json({
            message: "Ronda creada exitosamente",
            payload: newRound,
            status: "success",
        });
    }
    catch (error) {
        console.error("Error al crear la ronda:", error);
        res.status(500).json({
            message: "Error en el servidor",
            payload: null,
            status: "error",
        });
    }
};
exports.createRound = createRound;
const getMostRecentRound = async (req, res) => {
    try {
        const lastRound = await Round_1.Round.findOne({
            where: {
                match_id: req.params.id,
            },
            order: [["id", "DESC"]],
        });
        if (!lastRound) {
            res.status(500).json({
                message: "No existe la ronda",
                status: "error",
                payload: null,
            });
            return;
        }
        res.status(200).json({
            message: "Ronda obtenida correctamente",
            status: "success",
            payload: lastRound,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Problemas en el servidor: " + error,
            status: "error",
            payload: null,
        });
    }
};
exports.getMostRecentRound = getMostRecentRound;
