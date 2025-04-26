import { Request, Response, RequestHandler } from "express";
import { Team } from "../models/Team";

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
