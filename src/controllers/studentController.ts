import { Request, Response, RequestHandler } from "express";
import { Student } from "../models/Student";
import { StudentScore } from "../models/StudentScore";
import { Round } from "../models/Round";
import { Match } from "../models/Match";
import { registerStudents } from "./StudentTeamController";
import { changeTeamStatus } from "./teamController";

type NewStats = {
  played_rounds?: number;
  average_time?: number;
  average_match_position?: number;
  average_historic_position?: number;
};

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
  const { ids, team_id } = req.body;
  if (!Array.isArray(ids)) {
    res.status(400).json({
      message: "El cuerpo de la solicitud debe ser un arreglo de IDs",
      payload: null,
      status: "error",
    });
    return;
  }

  const studentIds: string[] = ids;

  try {
    await Promise.all(
      studentIds.map(async (id) => {
        const student = await Student.findByPk(id);
        if (!student) {
          await Student.create({
            id,
            played_rounds: 0,
            average_time: 0,
            average_match_position: 0,
            average_historic_position: 0,
          });
        }
      })
    );
    registerStudents(studentIds, team_id);
    changeTeamStatus(team_id);
    res.status(200).json({
      message: "Estudiantes creados correctamente (si no existían)",
      payload: null,
      status: "success",
    });
  } catch (error) {
    console.error(error);
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
) => {
  try {
    for (const id of studentIds) {
      const newStat: NewStats = {};

      const allStudentScores = await StudentScore.findAll({
        where: { student_id: id },
      });

      if (allStudentScores.length === 0) {
        continue;
      }

      const playedRounds = allStudentScores.length;
      newStat.played_rounds = playedRounds;

      const totalTime = allStudentScores.reduce((sum, score) => {
        return sum + (score.dataValues.time || 0);
      }, 0);
      newStat.average_time = parseFloat((totalTime / playedRounds).toFixed(2));

      const positionSum = allStudentScores.reduce((sum, score) => {
        return sum + (score.dataValues.position || 0);
      }, 0);
      newStat.average_historic_position = Math.ceil(positionSum / playedRounds);

      const matchScores = await StudentScore.findAll({
        where: { student_id: id },
        include: [
          {
            model: Round,
            where: { match_id: matchId },
            required: true,
          },
        ],
      });
      const matchPlayedRounds = matchScores.length;

      if (matchPlayedRounds > 0) {
        const positionSumMatch = matchScores.reduce((sum, score) => {
          return sum + (score.dataValues.position || 0);
        }, 0);
        newStat.average_match_position = Math.ceil(
          positionSumMatch / matchPlayedRounds
        );
      } else {
        newStat.average_match_position = 0;
      }

      if (Object.keys(newStat).length === 0) {
        continue;
      }

      const [updatedRows] = await Student.update(newStat, {
        where: { id: id },
      });
    }
  } catch (error) {
    console.log("Error updating student stats:");
    console.error(error);
  }
};
