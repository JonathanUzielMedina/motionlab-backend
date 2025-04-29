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
    // Get all team scores for this team
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
      console.log(`No scores found for team ${teamId} in match ${matchId}`);
      return;
    }

    // Calculate averages
    const playedRounds = teamScores.length;

    // Calculate average time, ensuring we don't get NaN
    let totalTime = 0;
    let validTimeCount = 0;

    teamScores.forEach((score) => {
      const time = score.dataValues.time;
      if (time !== null && time !== undefined && !isNaN(time)) {
        totalTime += time;
        validTimeCount++;
      }
    });

    // Default to 0 if no valid times are found
    const averageTime =
      validTimeCount > 0 ? Math.round(totalTime / validTimeCount) : 0;

    // Calculate average position, ensuring we don't get NaN
    let totalPosition = 0;
    let validPositionCount = 0;

    teamScores.forEach((score) => {
      const position = score.dataValues.position;
      if (position !== null && position !== undefined && !isNaN(position)) {
        totalPosition += position;
        validPositionCount++;
      }
    });

    // Default to 0 if no valid positions are found
    const averagePosition =
      validPositionCount > 0
        ? Math.round(totalPosition / validPositionCount)
        : 0;

    // Find or create team stats
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
      // Update existing team stats
      await teamStats.update({
        played_rounds: playedRounds,
        average_time: averageTime,
        average_position: averagePosition,
      });
    }

    console.log(`Team stats updated for team ${teamId}`);
    return teamStats;
  } catch (error) {
    console.error("Error al actualizar estadísticas de equipos:", error);
    throw error;
  }
};

// export const updateTeamStats = async (
//   team_id: number,
//   match_id: number
// ): Promise<void> => {
//   try {
//     const teamScores = await TeamScore.findAll({
//       where: {
//         team_id: team_id,
//       },
//     });

//     const playedRounds = teamScores.length;
//     const totalTime = teamScores.reduce((sum, score) => {
//       const value = score.time;
//       return sum + value;
//     }, 0);
//     const averageTime = parseFloat((totalTime / playedRounds).toFixed(2));

//     const sumPosition = teamScores.reduce((sum, score) => {
//       const value = score.position;
//       return sum + value;
//     }, 0);
//     const averagePosition = parseFloat((sumPosition / playedRounds).toFixed(2));

//     const newScore = {
//       played_rounds: playedRounds,
//       average_time: averageTime,
//       average_position: averagePosition,
//     };

//     const [updatedRows] = await TeamStats.update(newScore, {
//       where: {
//         team_id: team_id,
//       },
//     });
//   } catch (error) {
//     console.error("Error al actualizar estadísticas de equipos:", error);
//     throw error;
//   }
// };
