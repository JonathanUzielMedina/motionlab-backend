"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMatch = exports.getMatchesByTeacherId = exports.getMatchById = exports.getAllMatches = void 0;
const Match_1 = require("../models/Match");
// Obtener todos los matches
const getAllMatches = async (req, res) => {
    try {
        const matches = await Match_1.Match.findAll();
        res.status(200).json({
            message: "Partidas obtenidas exitosamente",
            payload: matches,
            status: "success",
        });
    }
    catch (error) {
        console.error("Error al obtener las partidas:", error);
        res.status(500).json({
            message: "Error en el servidor",
            payload: null,
            status: "error",
        });
    }
};
exports.getAllMatches = getAllMatches;
// Obtener un match por ID
const getMatchById = async (req, res) => {
    try {
        const { id } = req.params;
        const match = await Match_1.Match.findByPk(id);
        if (!match) {
            res.status(404).json({
                message: "Partida no encontrada",
                payload: null,
                status: "error",
            });
            return;
        }
        res.status(200).json({
            message: "Partida obtenida exitosamente",
            payload: match,
            status: "success",
        });
    }
    catch (error) {
        console.error("Error al obtener la partida:", error);
        res.status(500).json({
            message: "Error en el servidor",
            payload: null,
            status: "error",
        });
    }
};
exports.getMatchById = getMatchById;
// Obtener matches por ID del profesor
const getMatchesByTeacherId = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const matches = await Match_1.Match.findAll({
            where: {
                teacher_id: teacherId,
            },
        });
        res.status(200).json({
            message: "Partidas del profesor obtenidas exitosamente",
            payload: matches,
            status: "success",
        });
    }
    catch (error) {
        console.error("Error al obtener las partidas del profesor:", error);
        res.status(500).json({
            message: "Error en el servidor",
            payload: null,
            status: "error",
        });
    }
};
exports.getMatchesByTeacherId = getMatchesByTeacherId;
const createMatch = async (req, res) => {
    try {
        if (!req.body) {
            res.status(500).json({
                message: "Nada le fue enviado al servidor",
                payload: null,
                status: "error",
            });
            return;
        }
        const match = { ...req.body };
        match.code = Math.random().toString(36).substr(2, 8).toUpperCase();
        match.active = true;
        match.start_time = new Date();
        match.end_time = null;
        const data = await Match_1.Match.create(match);
        res.status(200).json({
            message: "Partida creada correctamente",
            payload: data,
            status: "success",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error en el servidor",
            payload: null,
            status: "error",
        });
    }
};
exports.createMatch = createMatch;
