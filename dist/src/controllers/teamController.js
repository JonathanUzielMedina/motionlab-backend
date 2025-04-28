"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTeam = exports.changeTeamStatus = void 0;
const Team_1 = require("../models/Team");
const Match_1 = require("../models/Match");
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
const createTeam = async (req, res) => {
    const { match_id } = req.body;
    if (!match_id) {
        res.status(400).json({
            message: "El body esta vacio",
            payload: null,
            status: "error",
        });
    }
    try {
        const match = await Match_1.Match.findByPk(match_id);
        if (!match) {
            res.status(404).json({
                message: "Esta partida no existe",
                payload: null,
                status: "error",
            });
            return;
        }
        const registeredTeams = await Team_1.Team.count({
            where: {
                match_id: match_id,
            },
        });
        if (registeredTeams >= match.teams) {
            res.status(500).json({
                message: "Se llego al limite de equipos en la partida",
                payload: null,
                status: "error",
            });
            return;
        }
        const team = {
            match_id: match_id,
            ready: false,
        };
        const newTeam = await Team_1.Team.create(team);
        res.status(200).json({
            message: "Equipo creado correctamente",
            status: "success",
            payload: { team_id: newTeam.id },
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error en el servidor" + error,
            payload: null,
            status: "error",
        });
    }
};
exports.createTeam = createTeam;
