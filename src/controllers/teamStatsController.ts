import { Request, Response, RequestHandler } from "express";
import { TeamStats } from "../models/TeamStats";
import { TeamScore } from "../models/TeamScore";
import { Round } from "../models/Round";

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

export const updateTeamStats = async (teamId: number, matchId: number) => {
  try {
    const teamScores = await TeamScore.findAll({
      where: {
        team_id: teamId,
      },
      include: [
        {
          model: Round,
          where: {
            match_id: matchId,
          },
          required: true,
        },
      ],
    });

    if (teamScores.length === 0) {
      return;
    }

    const playedRounds = teamScores.length;

    let totalTime = 0;
    let validTimeCount = 0;

    teamScores.forEach((score) => {
      const time = score.dataValues.time;
      if (time !== null && time !== undefined && !isNaN(time)) {
        totalTime += time;
        validTimeCount++;
      }
    });

    const averageTime =
      validTimeCount > 0 ? Math.round(totalTime / validTimeCount) : 0;

    let totalPosition = 0;
    let validPositionCount = 0;

    teamScores.forEach((score) => {
      const position = score.dataValues.position;
      if (position !== null && position !== undefined && !isNaN(position)) {
        totalPosition += position;
        validPositionCount++;
      }
    });

    const averagePosition =
      validPositionCount > 0
        ? Math.round(totalPosition / validPositionCount)
        : 0;

    const [teamStats, created] = await TeamStats.findOrCreate({
      where: { team_id: teamId },
      defaults: {
        team_id: teamId,
        played_rounds: playedRounds,
        average_time: averageTime,
        average_position: averagePosition,
      },
    });

    if (!created) {
      await teamStats.update({
        played_rounds: playedRounds,
        average_time: averageTime,
        average_position: averagePosition,
      });
    }

    return teamStats;
  } catch (error) {
    throw error;
  }
};
