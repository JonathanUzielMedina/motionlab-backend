import { Request, Response, RequestHandler } from "express";
import { Team } from "../models/Team";
import { Match } from "../models/Match";

export const changeTeamStatus: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const team = await Team.findByPk(id);
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
  } catch (error) {
    res.status(500).json({
      message: "Problemas en el servidor",
      status: "error",
      payload: null,
    });
  }
};

export const createTeam: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { match_id } = req.body;
  if (!match_id) {
    res.status(400).json({
      message: "El body esta vacio",
      payload: null,
      status: "error",
    });
  }
  try {
    const match = await Match.findByPk(match_id);
    if (!match) {
      res.status(404).json({
        message: "Esta partida no existe",
        payload: null,
        status: "error",
      });
      return;
    }
    const registeredTeams = await Team.count({
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
    const newTeam: Team = await Team.create(team);

    res.status(200).json({
      message: "Equipo creado correctamente",
      status: "success",
      payload: { team_id: newTeam.id },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor" + error,
      payload: null,
      status: "error",
    });
  }
};
