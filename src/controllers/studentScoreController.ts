import { Request, Response, RequestHandler } from "express";
import { StudentScore } from "../models/StudentScore";
import { Student } from "../models/Student";
import { Round } from "../models/Round";
import { updateStudentStats } from "./studentController";
import { Match } from "../models/Match";

type StudentResult = {
  student_id: string;
  time: number;
  distance: number;
};

type Score = {
  student_id: string;
  round_id: number;
  score: number;
  time: number;
  position: number;
};

export const getStudentScoreByRound: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const studentScores: StudentScore[] = await StudentScore.findAll({
      where: {
        round_id: req.params,
      },
    });

    res.status(200).json({
      message: "Scores obtenidos correctamente",
      status: "succes",
      payload: studentScores,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      payload: null,
      status: "error",
    });
  }
};

// Obtener los scores de un estudiante por ID de ronda
export const getStudentScoresById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const rawData: StudentScore[] = await StudentScore.findAll({
      where: {
        round_id: id,
      },
      include: [
        {
          model: Student,
        },
      ],
    });

    const data = rawData.map((element) => ({
      studentId: element.student.id,
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
      message: "Error en el servidor",
      payload: null,
      status: "error",
    });
  }
};

export const getAllStudentScores: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const rawScores = await StudentScore.findAll({
      order: [["score", "DESC"]],
    });

    const scores = rawScores.map((score) => ({
      id: score.dataValues.student_id,
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

export const createStudentScores: RequestHandler = async (
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
  const { results, roundId }: { results: StudentResult[]; roundId: number } =
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
    const scores: Score[] = [];
    const studentsIds: string[] = [];
    results.forEach((result) => {
      studentsIds.push(result.student_id);
      const score = (result.distance / result.time) * 1000;
      scores.push({
        score: score,
        student_id: result.student_id,
        round_id: roundId,
        time: result.time,
        position: 0,
      });
    });

    await StudentScore.bulkCreate(scores, { validate: true });

    const allScores: StudentScore[] = await StudentScore.findAll({
      where: { round_id: roundId },
    });

    const sortedScores = [...allScores].sort((a, b) => {
      const scoreA = a.dataValues?.score || 0;
      const scoreB = b.dataValues?.score || 0;
      return scoreB - scoreA;
    });

    for (let i = 0; i < sortedScores.length; i++) {
      await StudentScore.update(
        { position: i + 1 },
        {
          where: {
            id: sortedScores[i].dataValues.id,
          },
        }
      );
    }

    await updateStudentStats(studentsIds, matchId);

    res.status(200).json({
      message:
        "Nuevos puntajes calculados correctamente y posiciones actualizadas",
      status: "success",
      payload: null,
    });
  } catch (error) {
    console.error("Error en createStudentScores:", error);
    res.status(500).json({
      message: "Error en el servidor " + error,
      status: "error",
      payload: null,
    });
  }
};

export const deleteAllStudentScores: RequestHandler = async (req, res) => {
  try {
    const deletedCount = await StudentScore.destroy({
      where: {},
    });

    if (deletedCount === 0) {
      res.status(404).json({
        message: "No se encontraron registros para eliminar",
        status: "error",
        payload: null,
      });
      return;
    }

    res.status(200).json({
      message: `${deletedCount} registros de puntajes eliminados correctamente`,
      status: "success",
      payload: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Hubo un problema al eliminar los registros: " + error,
      status: "error",
      payload: null,
    });
  }
};
