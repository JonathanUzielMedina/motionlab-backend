import { Request, Response, RequestHandler } from "express";
import { Team } from "../models/Team";
import { TeamStats } from "../models/TeamStats";

//actualizar el estado del equipo por id a listo
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

//crear un equipo e inicializar sus estadísticas en 0
export const createTeam: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
      const { id, match_id, ready = false } = req.body;
      
      
      const newTeam = await Team.create({
          id,
          match_id,
          ready
      });
      
      
      await TeamStats.create({
          team_id: newTeam.id,
          played_rounds: 0,
          average_time: 0,
          average_position: 0
      });
      
      res.status(201).json({
          status: "success",
          message: "Equipo creado correctamente con estadísticas inicializadas.",
          payload: newTeam,
      });
  } catch (error) {
      console.error("Error al crear el equipo:", error);
      res.status(500).json({
          status: "error",
          message: "Hubo un problema en el servidor.",
          payload: null,
      });
  }
};