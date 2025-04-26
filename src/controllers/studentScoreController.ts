import { Request, Response, RequestHandler } from "express";
import { StudentScore } from "../models/StudentScore";
import { Student } from "../models/Student";

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
