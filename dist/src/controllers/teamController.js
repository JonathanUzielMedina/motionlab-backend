"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTeam = exports.changeTeamStatus = void 0;
const Team_1 = require("../models/Team");
const TeamStats_1 = require("../models/TeamStats");
const Match_1 = require("../models/Match");
//actualizar el estado del equipo por id a listo
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
            message: "El body está incompleto: falta 'match_id'.",
            payload: null,
            status: "error",
        });
        return;
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
        const registeredTeams = await Team_1.Team.count({ where: { match_id } });
        if (registeredTeams >= match.teams) {
            res.status(400).json({
                message: "Se llegó al límite de equipos en la partida",
                payload: null,
                status: "error",
            });
            return;
        }
        const newTeam = await Team_1.Team.create({
            match_id,
            ready: false,
        });
        await TeamStats_1.TeamStats.create({
            team_id: newTeam.id,
            played_rounds: 0,
            average_time: 0,
            average_position: 0,
        });
        res.status(201).json({
            message: "Equipo creado correctamente con estadísticas inicializadas",
            status: "success",
            payload: {
                team_id: newTeam.id,
            },
        });
    }
    catch (error) {
        console.error("Error en createTeam:", error);
        res.status(500).json({
            message: "Error en el servidor",
            payload: null,
            status: "error",
        });
    }
};
exports.createTeam = createTeam;
