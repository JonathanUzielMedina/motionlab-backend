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
    if (!req.body) {
      res.status(500).json({
        message: "Nada le fue enviado al servidor",
        payload: null,
        status: "error",
      });
      return;
    }

    const student = { ...req.body };
    const data: Student = await Student.create(student);

    res.status(200).json({
      message: "Estudiante creado correctamente",
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

export const updateStudentStats: RequestHandler = async (
  req: Request,
  res: Response
) => {
  if (!req.body) {
    res.status(400).json({
      status: "error",
      message: "No existe un cuerpo en la solicitud",
      payload: null,
    });
    return;
  }

  const { student_ids, match_id } = req.body;

  try {
    // 1. Conseguir todas las rondas que pertenecen al match
    const rounds = await Round.findAll({
      where: { match_id: match_id },
    });
    const roundIds = rounds.map((r) => r.id);

    // 2. Procesar cada estudiante
    for (const student_id of student_ids) {
      // Traer TODOS sus scores
      const allScores = await StudentScore.findAll({
        where: { student_id: student_id },
      });

      // Traer SOLO sus scores de las rondas de este match
      const matchScores = await StudentScore.findAll({
        where: {
          student_id: student_id,
          round_id: roundIds, // Sequelize entiende arrays aquí
        },
      });

      // --- Calcular estadísticas ---
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

      // 3. Actualizar al estudiante
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

    res.status(200).json({
      status: "success",
      message: "Estadísticas actualizadas exitosamente",
      payload: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error en el servidor " + error,
      payload: null,
    });
  }
};
