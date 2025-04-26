import { Request, Response, RequestHandler } from "express";
import { Team } from "../models/Team";
import { Student } from "../models/Student";
import { StudentTeam } from "../models/StudentTeam";

export const getLobbyTeams: RequestHandler = async (req, res) => {
  const { matchId } = req.params;

  try {
    const teams = await Team.findAll({
      where: {
        match_id: matchId,
        ready: true,
      },
      include: [
        {
          model: StudentTeam,
          include: [
            {
              model: Student,
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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error al obtener equipos",
      payload: null,
    });
  }
};
