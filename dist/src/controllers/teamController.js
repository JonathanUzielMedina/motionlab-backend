"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTeams = exports.createTeam = exports.changeTeamStatus = void 0;
const Team_1 = require("../models/Team");
const TeamStats_1 = require("../models/TeamStats");
const Match_1 = require("../models/Match");
//actualizar el estado del equipo por id a listo
const changeTeamStatus = async (id) => {
    try {
        const team = await Team_1.Team.findByPk(id);
        if (!team) {
            console.log("No existe este equipo");
            return;
        }
        await team.update({ ready: true });
    }
    catch (error) {
        console.log(error);
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
        // Use Sequelize's managed transaction approach
        const result = await Match_1.Match.sequelize.transaction(async (t) => {
            const match = await Match_1.Match.findByPk(match_id, { transaction: t });
            if (!match) {
                throw new Error("Match not found");
            }
            // Get count within the same transaction
            const registeredTeams = await Team_1.Team.count({
                where: { match_id },
                transaction: t,
            });
            if (registeredTeams >= match.teams) {
                throw new Error("Team limit reached");
            }
            const newTeam = await Team_1.Team.create({
                match_id,
                ready: false,
            }, { transaction: t });
            await TeamStats_1.TeamStats.create({
                team_id: newTeam.id,
                played_rounds: 0,
                average_time: 0,
                average_position: 0,
            }, { transaction: t });
            return newTeam;
        });
        res.status(201).json({
            message: "Equipo creado correctamente con estadísticas inicializadas",
            status: "success",
            payload: {
                team_id: result.id,
            },
        });
    }
    catch (error) {
        console.error("Error en createTeam:", error);
        // Custom error handling based on error message
        if (error === "Match not found") {
            res.status(404).json({
                message: "Esta partida no existe",
                payload: null,
                status: "error",
            });
            return;
        }
        if (error === "Team limit reached") {
            res.status(400).json({
                message: "Se llegó al límite de equipos en la partida",
                payload: null,
                status: "error",
            });
            return;
        }
        res.status(500).json({
            message: "Error en el servidor",
            payload: null,
            status: "error",
        });
    }
};
exports.createTeam = createTeam;
// export const createTeam: RequestHandler = async (
//   req: Request,
//   res: Response
// ) => {
//   const { match_id } = req.body;
//   if (!match_id) {
//     res.status(400).json({
//       message: "El body está incompleto: falta 'match_id'.",
//       payload: null,
//       status: "error",
//     });
//     return;
//   }
//   try {
//     const match = await Match.findByPk(match_id);
//     if (!match) {
//       res.status(404).json({
//         message: "Esta partida no existe",
//         payload: null,
//         status: "error",
//       });
//       return;
//     }
//     const registeredTeams = await Team.count({ where: { match_id } });
//     if (registeredTeams >= match.teams) {
//       res.status(400).json({
//         message: "Se llegó al límite de equipos en la partida",
//         payload: null,
//         status: "error",
//       });
//       return;
//     }
//     const newTeam = await Team.create({
//       match_id,
//       ready: false,
//     });
//     await TeamStats.create({
//       team_id: newTeam.id,
//       played_rounds: 0,
//       average_time: 0,
//       average_position: 0,
//     });
//     res.status(201).json({
//       message: "Equipo creado correctamente con estadísticas inicializadas",
//       status: "success",
//       payload: {
//         team_id: newTeam.id,
//       },
//     });
//   } catch (error) {
//     console.error("Error en createTeam:", error);
//     res.status(500).json({
//       message: "Error en el servidor",
//       payload: null,
//       status: "error",
//     });
//   }
// };
const getAllTeams = async (req, res) => {
    try {
        const teams = await Team_1.Team.findAll();
        res.status(200).json({
            message: "Equipos obtenidos correctamente",
            payload: teams,
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
exports.getAllTeams = getAllTeams;
