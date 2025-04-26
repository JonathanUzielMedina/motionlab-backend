import { Request, Response, RequestHandler } from "express";
import { Team } from "../models/Team";
import { TeamScore } from "../models/TeamScore";

export const getTeamScoreById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const rawData: TeamScore[] = await TeamScore.findAll({
      include: [
        {
          model: Team,
        },
      ],
      where: {
        round_id: id,
      },
    });

    const data = rawData.map((element) => ({
      teamId: element.team.id,
      position: element.position,
      time: element.time,
      score: element.score,
    }));

    res.status(200).json({
      message: "Score obtenidos exitosamente",
      payload: data,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: "Hubo un problema en el servidor",
      payload: null,
      status: "error",
    });
  }
};
