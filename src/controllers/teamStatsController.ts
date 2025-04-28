import { Request, Response, RequestHandler } from "express";
import { TeamStats } from "../models/TeamStats";
import { TeamScore } from "../models/TeamScore";



//obetener estadisticas de todos los equipos
export const getAllTeamStats: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const data: TeamStats[] = await TeamStats.findAll();
    res.status(200).json({
      status: "success",
      message: "Estadisticas del equipo fueron recuperadas correctamente.",
      payload: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Hubo un problema en el servidor.",
      payload: null,
    });
  }
};

//crear score de un equipo y actualizar estadisticas con promedios
export const createTeamStat: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
      const { team_id, round_id, position, time, score } = req.body;
      
      // Crear el nuevo registro de score
      const newTeamScore = await TeamScore.create({
          team_id,
          round_id,
          position,
          time,
          score
      });
      
      const teamScores = await TeamScore.findAll({
          where: {
              team_id
          }
      });
      
      // Calcular nuevos promedios
      const played_rounds = teamScores.length;
      let total_time = 0;
      let total_position = 0;
      
      teamScores.forEach(teamScore => {
          total_time += teamScore.time;
          total_position += teamScore.position;
      });
      
      const average_time = total_time / played_rounds;
      const average_position = total_position / played_rounds;
      
      // Actualizar las estadísticas del equipo
      const teamStats = await TeamStats.findOne({
          where: {
              team_id
          }
      });
      
      if (teamStats) {
          await teamStats.update({
              played_rounds,
              average_time,
              average_position
          });
      } else {
          await TeamStats.create({
              team_id,
              played_rounds,
              average_time,
              average_position
          });
      }
      
      res.status(201).json({
          status: "success",
          message: "Score registrado y estadísticas actualizadas correctamente.",
          payload: newTeamScore,
      });
  } catch (error) {
      console.error("Error al registrar score:", error);
      res.status(500).json({
          status: "error",
          message: "Hubo un problema en el servidor.",
          payload: null,
      });
  }
}