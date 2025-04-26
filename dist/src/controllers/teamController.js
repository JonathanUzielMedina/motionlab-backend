"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeTeamStatus = void 0;
const Team_1 = require("../models/Team");
const changeTeamStatus = async (req, res) => {
    const { id } = req.params;
    try {
        const team = await Team_1.Team.findByPk(id);
        if (!team) {
            res.status(404).json({
                message: "Equipo no encontrado",
                status: "error",
                payload: null,
            });
            return;
        }
        team.ready = true;
        await team.save();
        res.status(200).json({
            message: "Estado del equipo actualizado correctamente",
            status: "success",
            payload: null,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Problemas en el servidor",
            status: "error",
            payload: null,
        });
    }
};
exports.changeTeamStatus = changeTeamStatus;
