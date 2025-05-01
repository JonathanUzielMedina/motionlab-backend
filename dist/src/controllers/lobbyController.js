"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeamFromLobby = exports.lobbyAccess = exports.getLobbyTeams = void 0;
const Team_1 = require("../models/Team");
const StudentTeam_1 = require("../models/StudentTeam");
const Match_1 = require("../models/Match");
const getLobbyTeams = async (req, res) => {
    const { matchId } = req.params;
    try {
        const teams = await Team_1.Team.findAll({
            where: {
                match_id: matchId,
                ready: true,
            },
        });
        const lobbyTeams = [];
        for (const element of teams) {
            const team = {};
            team.team_id = element.dataValues.id;
            const st = await StudentTeam_1.StudentTeam.findAll({
                where: {
                    id_team: element.dataValues.id,
                },
            });
            const students = [];
            st.map((a) => {
                const student = a.dataValues.id_student;
                students.push(student);
            });
            team.student_ids = students;
            lobbyTeams.push(team);
        }
        res.status(200).json({
            status: "success",
            message: "Equipos obtenidos correctamente",
            payload: lobbyTeams,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Error al obtener equipos",
            payload: null,
        });
    }
};
exports.getLobbyTeams = getLobbyTeams;
const lobbyAccess = async (req, res) => {
    const { code } = req.params;
    if (!code) {
        res.status(400).json({
            status: "error",
            message: "No se proporcionó el código de partida",
            payload: null,
        });
        return;
    }
    try {
        const match = await Match_1.Match.findOne({
            where: {
                code: code,
            },
        });
        console.log(match);
        if (!match) {
            res.status(404).json({
                status: "error",
                message: "Codigo invalido o la partida ya fue cerrada",
                payload: null,
            });
            return;
        }
        res.status(200).json({
            status: "success",
            message: "Codigo valido",
            payload: match,
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
exports.lobbyAccess = lobbyAccess;
const deleteTeamFromLobby = async (req, res) => {
    const { id } = req.params;
    try {
        await Team_1.Team.destroy({
            where: {
                id: id,
            },
        });
        res.status(200).json({
            status: "success",
            message: "Equipo eliminado correctamente",
            teamId: id,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al intentar eliminar el equipo",
            payload: null,
        });
    }
};
exports.deleteTeamFromLobby = deleteTeamFromLobby;
