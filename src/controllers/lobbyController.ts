import { Request, Response, RequestHandler } from "express";
import { Team } from "../models/Team";
import { Student } from "../models/Student";
import { StudentTeam } from "../models/StudentTeam";
import { Match } from "../models/Match";

type Lobbys = {
  team_id?: number;
  student_ids?: string[];
};

export const getLobbyTeams: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { matchId } = req.params;

  try {
    const teams = await Team.findAll({
      where: {
        match_id: matchId,
        ready: true,
      },
    });

    const lobbyTeams: Lobbys[] = [];

    for (const element of teams) {
      const team: Lobbys = {};
      team.team_id = element.dataValues.id;
      const st = await StudentTeam.findAll({
        where: {
          id_team: element.dataValues.id,
        },
      });
      const students: string[] = [];
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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error al obtener equipos",
      payload: null,
    });
  }
};

export const lobbyAccess: RequestHandler = async (
  req: Request,
  res: Response
) => {
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
    const match = await Match.findOne({
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
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      payload: null,
      status: "error",
    });
  }
};

export const deleteTeamFromLobby: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    await Team.destroy({
      where: {
        id: id,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Equipo eliminado correctamente",
      teamId: id,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al intentar eliminar el equipo",
      payload: null,
    });
  }
};
