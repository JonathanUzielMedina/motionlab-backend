import { Request, Response, RequestHandler } from "express";
import { Team } from "../models/Team";
import { TeamScore } from "../models/TeamScore";
import { StudentScore } from "../models/StudentScore";
import { StudentTeam } from "../models/StudentTeam";
import { updateTeamStats } from "./teamStatsController";
import { Round } from "../models/Round";
// Obtener los scores de un equipo por ID de ronda

type TeamResult = {
  team_id: number;
  time: number;
};

type Score = {
  team_id: string;
  round_id: number;
  score: number;
  time: number;
  position: number;
};

interface TeamScoreAttributes {
  team_id: number;
  round_id: number;
  score: number;
  time: number;
  position: number;
}

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

export const createTeamScore: RequestHandler = async (
  req: Request,
  res: Response
) => {
  if (!req.body) {
    res.status(400).json({
      message: "El cuerpo de la request está vacío",
      status: "error",
      payload: null,
    });
    return;
  }

  const { results, roundId }: { results: TeamResult[]; roundId: number } =
    req.body;
  const match = await Round.findByPk(roundId);
  if (!match) {
    return;
  }
  const matchId = await match.dataValues.id;
  try {
    const teamScores: TeamScoreAttributes[] = [];
    const teamIds: number[] = [];

    for (const result of results) {
      const { team_id, time } = result;
      teamIds.push(team_id);
      const studentTeams = await StudentTeam.findAll({
        where: { id_team: team_id },
      });

      const studentIds = studentTeams.map((st) => st.id_student);

      if (studentIds.length === 0) {
        continue;
      }
      const studentScores = await StudentScore.findAll({
        where: {
          student_id: studentIds,
          round_id: roundId,
        },
      });

      if (studentScores.length === 0) {
        continue;
      }

      const totalScore = studentScores.reduce(
        (acc, score) => acc + score.score,
        0
      );
      const averageScore = totalScore / studentScores.length;

      teamScores.push({
        team_id,
        round_id: roundId,
        score: averageScore,
        time,
        position: 0,
      });
    }
    teamScores.sort((a, b) => b.score - a.score);

    teamScores.forEach((teamScore, index) => {
      teamScore.position = index + 1;
    });

    await TeamScore.bulkCreate(teamScores);

    updateTeamStats(teamIds, matchId);

    res.status(201).json({
      message: "Puntajes de equipos creados exitosamente.",
      status: "success",
      payload: teamScores,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Problemas en el servidor: " + error,
      status: "error",
      payload: null,
    });
  }
};
