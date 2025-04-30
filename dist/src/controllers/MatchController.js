"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchStatus = exports.changeMatchStatus = exports.getMatchParameters = exports.getMatchByCode = exports.createMatch = exports.getMatchesByTeacherId = exports.getAllMatches = void 0;
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
        match.active = false;
        match.start_time = new Date();
        match.end_time = null;
        console.log(match);
        const data = await Match_1.Match.create(match);
        res.status(200).json({
            message: "Partida creada correctamente",
            payload: data,
            status: "success",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error en el servidor " + error,
            payload: null,
            status: "error",
        });
    }
};
exports.createMatch = createMatch;
const getMatchByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const match = await Match_1.Match.findOne({
            where: {
                code: code,
            },
        });
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
exports.getMatchByCode = getMatchByCode;
const getMatchParameters = async (req, res) => {
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
            message: "Parámetros de la partida obtenidos exitosamente",
            payload: {
                rpm: match.dataValues.rpm,
                wheel_size: match.dataValues.wheel_size,
                distance: match.dataValues.distance,
            },
            status: "success",
        });
    }
    catch (error) {
        console.error("Error al obtener los parámetros de la partida:", error);
        res.status(500).json({
            message: "Error en el servidor",
            payload: null,
            status: "error",
        });
    }
};
exports.getMatchParameters = getMatchParameters;
const changeMatchStatus = async (req, res) => {
    if (!req.body) {
        res.status(500).json({
            message: "Cuerpo esta vacio",
            status: "error",
            payload: null,
        });
    }
    const { match_id } = req.body;
    try {
        const match = await Match_1.Match.findByPk(match_id);
        if (!match) {
            res.status(500).json({
                message: "No existe esa partida",
                status: "error",
                payload: null,
            });
            return;
        }
        const newStatus = !match.dataValues.active;
        await match.update({ active: newStatus });
        res.status(200).json({
            message: "Status cambiado correctamente",
            status: "success",
            payload: null,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error en el servidor " + error,
            status: "error",
            payload: null,
        });
    }
};
exports.changeMatchStatus = changeMatchStatus;
const getMatchStatus = async (req, res) => {
    const { match_id } = req.params;
    try {
        const match = await Match_1.Match.findByPk(match_id);
        if (!match) {
            res.status(500).json({
                message: "No existe esa partida",
                status: "error",
                payload: null,
            });
            return;
        }
        res.status(200).json({
            message: "Se recupero el status correctamente",
            status: "success",
            payload: match.dataValues.active,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error en el servidor " + error,
            status: "error",
            payload: null,
        });
    }
};
exports.getMatchStatus = getMatchStatus;
