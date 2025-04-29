import { Request, Response, RequestHandler } from "express";
import { Student } from "../models/Student";
import { StudentScore } from "../models/StudentScore";
import { Round } from "../models/Round";

//obtener todos los estudiantes
export const getAllStudents: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const data: Student[] = await Student.findAll();
    res.status(200).json({
      message: "Estadisticas de los estudiantes obtenidas correctamente",
      payload: data,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: "Hubo problemas en el servidor",
      payload: null,
      status: "error",
    });
  }
};

//crear un estudiante
export const createStudent: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const studentIds: string[] = req.body;

    if (!req.body) {
      res.status(500).json({
        message: "Nada le fue enviado al servidor",
        payload: null,
        status: "error",
      });
      return;
    }

    studentIds.forEach(async (id) => {
      const student = await Student.findByPk(id);
      if (!student) {
        await Student.create({
          id: id,
          played_rounds: 0,
          average_time: 0,
          average_match_position: 0,
          average_historic_position: 0,
        });
      }
    });
    res.status(200).json({
      message: "Estudiante creado correctamente",
      payload: null,
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

export const updateStudentStats = async (
  studentIds: string[],
  matchId: number
): Promise<void> => {
  try {
    const rounds = await Round.findAll({
      where: { match_id: matchId },
    });
    const roundIds = rounds.map((r) => r.id);

    for (const student_id of studentIds) {
      const allScores = await StudentScore.findAll({
        where: { student_id: student_id },
      });

      const matchScores = await StudentScore.findAll({
        where: {
          student_id: student_id,
          round_id: roundIds,
        },
      });

      const played_rounds = allScores.length;

      const total_time = allScores.reduce((acc, score) => acc + score.time, 0);
      const average_time = played_rounds > 0 ? total_time / played_rounds : 0;

      const total_historic_position = allScores.reduce(
        (acc, score) => acc + score.position,
        0
      );
      const average_historic_position =
        played_rounds > 0 ? total_historic_position / played_rounds : 0;

      const total_match_position = matchScores.reduce(
        (acc, score) => acc + score.position,
        0
      );
      const average_match_position =
        matchScores.length > 0 ? total_match_position / matchScores.length : 0;

      await Student.update(
        {
          played_rounds,
          average_time,
          average_historic_position,
          average_match_position,
        },
        { where: { id: student_id } }
      );
    }
  } catch (error) {
    console.error(error);
  }
};
