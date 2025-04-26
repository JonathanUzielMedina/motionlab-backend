"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLobbyTeams = void 0;
const Team_1 = require("../models/Team");
const Student_1 = require("../models/Student");
const StudentTeam_1 = require("../models/StudentTeam");
const getLobbyTeams = async (req, res) => {
    const { matchId } = req.params;
    try {
        const teams = await Team_1.Team.findAll({
            where: {
                match_id: matchId,
                ready: true,
            },
            include: [
                {
                    model: StudentTeam_1.StudentTeam,
                    include: [
                        {
                            model: Student_1.Student,
                            attributes: ["id"],
                        },
                    ],
                },
            ],
        });
        const lobbyTeams = teams.map((team) => ({
            teamId: team.id,
            students: team.studentTeams.map((st) => ({
                id: st.student.id,
            })),
        }));
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
