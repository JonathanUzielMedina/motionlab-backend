import { Request, Response, RequestHandler } from "express";
import { Team } from "../models/Team";
import { TeamScore } from "../models/TeamScore";
import { StudentScore } from "../models/StudentScore";
import { StudentTeam } from "../models/StudentTeam";
import { updateTeamStats } from "./teamStatsController";
import { Student } from "../models/Student";
import { Match } from "../models/Match";
import { Round } from "../models/Round";
// Obtener los scores de un equipo por ID de ronda

type TeamResult = {
  team_id: number;
  time: number;
};

type Score = {
  team_id: number;
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
    const id = req.params.id;
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

export const getAllTeamScores: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const rawScores = await TeamScore.findAll({
      order: [["score", "DESC"]],
    });

    const scores = rawScores.map((score) => ({
      id: score.dataValues.team_id,
      time: score.dataValues.time,
      score: score.dataValues.score,
    }));

    res.status(200).json({
      message: "Puntajes de los alumnos obtenidos correctamente",
      status: "success",
      payload: scores,
    });
  } catch (error) {
    res.status(500).json({
      message: "Problemas en el servidor " + error,
      status: "Error",
      payload: null,
    });
  }
};

export const createTeamScore: RequestHandler = async (
  req: Request,
  res: Response
) => {
  if (!req.body) {
    res.status(400).json({
      message: "El body estaba vacio",
      status: "error",
      payload: null,
    });
    return;
  }
  const { results, roundId }: { results: TeamResult; roundId: number } =
    req.body;
  const round = await Round.findByPk(roundId, {
    include: [
      {
        model: Match,
      },
    ],
  });
  if (!round) {
    res.status(404).json({
      message: "Round no encontrado",
      status: "error",
      payload: null,
    });
    return;
  }
  const matchId = round.dataValues.match_id;

  try {
    const studentScores = await StudentScore.findAll({
      where: {
        round_id: roundId,
      },
      include: [
        {
          model: Student,
          required: true,
          include: [
            {
              model: StudentTeam,
              where: { id_team: results.team_id },
              required: true,
            },
          ],
        },
      ],
    });

    if (studentScores.length === 0) {
      res.status(400).json({
        message: "No se encontraron puntajes de estudiantes para este equipo",
        status: "error",
        payload: null,
      });
      return;
    }

    const totalScores = studentScores.length;
    const totalScore = studentScores.reduce((sum, score) => {
      const value = score.dataValues.score || 0;
      return sum + value;
    }, 0);
    const teamScore = Math.ceil(totalScore / totalScores);

    const time =
      results.time !== undefined && !isNaN(results.time) ? results.time : 0;

    const score = {
      team_id: results.team_id,
      round_id: roundId,
      score: teamScore,
      time: time,
      position: 0,
    };

    await TeamScore.create(score);

    const allScores: TeamScore[] = await TeamScore.findAll({
      where: {
        round_id: roundId,
      },
    });

    const sortedScores = [...allScores].sort((a, b) => {
      const scoreA = a.dataValues?.score || 0;
      const scoreB = b.dataValues?.score || 0;
      return scoreB - scoreA;
    });

    for (let i = 0; i < sortedScores.length; i++) {
      await TeamScore.update(
        { position: i + 1 },
        {
          where: {
            id: sortedScores[i].dataValues.id,
          },
        }
      );
    }

    try {
      await updateTeamStats(results.team_id, matchId);
    } catch (statsError) {
      console.error(
        "Error updating team stats, but score was created:",
        statsError
      );
    }

    res.status(201).json({
      message: "Puntajes de equipos creados exitosamente.",
      status: "success",
      payload: null,
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

export const getTeamScoresByRound: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const teamScores: TeamScore[] = await TeamScore.findAll({
      where: {
        round_id: req.params.id,
      },
    });
    res.status(200).json({
      message: "Scores de los equipos obtenidos correctamente",
      status: "success",
      payload: teamScores,
    });
  } catch (error) {
    res.status(500).json({
      message: "Problema interno del servidor " + error,
      status: "error",
      payload: null,
    });
  }
};
