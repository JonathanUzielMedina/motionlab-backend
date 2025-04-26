import { Request, Response, RequestHandler } from "express";
import { TeamStats } from "../models/TeamStats";

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
