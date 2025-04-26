"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTeamStats = void 0;
const TeamStats_1 = require("../models/TeamStats");
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
