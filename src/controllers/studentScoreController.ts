import { Request, Response, RequestHandler } from "express";
import { StudentScore } from "../models/StudentScore";
import { Student } from "../models/Student";
import { Round } from "../models/Round";
import { updateStudentStats } from "./studentController";

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
  const match = await Round.findByPk(roundId);
  if (!match) {
    return;
  }
  const matchId = await match.dataValues.id;
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

    const allScores = await StudentScore.findAll({
      where: { round_id: roundId },
    });

    const sortedScores = allScores.sort((a, b) => b.score - a.score);

    // Asignamos posición
    await Promise.all(
      sortedScores.map(async (scoreEntry, index) => {
        scoreEntry.position = index + 1;
        await scoreEntry.save();
      })
    );
    updateStudentStats(studentsIds, matchId);
    res.status(200).json({
      message:
        "Nuevos puntajes calculados correctamente y posiciones actualizadas",
      status: "success",
      payload: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor " + error,
      status: "error",
      payload: null,
    });
  }
};
