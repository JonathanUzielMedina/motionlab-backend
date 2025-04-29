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
    console.log(
      `Starting to update stats for ${studentIds.length} students in match ${matchId}`
    );

    for (const id of studentIds) {
      console.log(`Processing student ID: ${id}`);
      const newStat: NewStats = {};

      // Get all scores for this student (for historical average)
      const allStudentScores = await StudentScore.findAll({
        where: { student_id: id },
      });

      console.log(
        `Found ${allStudentScores.length} total scores for student ${id}`
      );

      if (allStudentScores.length === 0) {
        console.log(
          `No scores found for student ${id}. Skipping stats calculation.`
        );
        continue; // Skip this student since there's no data to calculate stats from
      }

      const playedRounds = allStudentScores.length;
      newStat.played_rounds = playedRounds;
      console.log(`Setting played_rounds to ${playedRounds}`);

      // Calculate historical average time
      const totalTime = allStudentScores.reduce((sum, score) => {
        console.log(`Score.dsez.time ${score.dataValues.time}`);
        return sum + (score.dataValues.time || 0); // Handle potential null/undefined times
      }, 0);
      console.log(`totalTime ${totalTime}`);
      newStat.average_time = parseFloat((totalTime / playedRounds).toFixed(2));
      console.log(`Setting average_time to ${newStat.average_time}`);

      // Calculate historical average position
      const positionSum = allStudentScores.reduce((sum, score) => {
        console.log(`Score.datavalues.position ${score.dataValues.position}`);
        return sum + (score.dataValues.position || 0); // Handle potential null/undefined positions
      }, 0);
      console.log(`positionSum ${positionSum}`);
      newStat.average_historic_position = Math.ceil(positionSum / playedRounds);
      console.log(
        `Setting average_historic_position to ${newStat.average_historic_position}`
      );

      // Get only scores for this student in THIS match
      const matchScores = await StudentScore.findAll({
        where: { student_id: id },
        include: [
          {
            model: Round,
            where: { match_id: matchId },
            required: true, // Ensures inner join
          },
        ],
      });

      console.log(
        `Found ${matchScores.length} scores for student ${id} in match ${matchId}`
      );

      const matchPlayedRounds = matchScores.length;

      // Calculate match average position (only if they played in this match)
      if (matchPlayedRounds > 0) {
        const positionSumMatch = matchScores.reduce((sum, score) => {
          console.log(`Score.datavalues.position ${score.dataValues.position}`);
          return sum + (score.dataValues.position || 0);
        }, 0);
        newStat.average_match_position = Math.ceil(
          positionSumMatch / matchPlayedRounds
        );
        console.log(
          `Setting average_match_position to ${newStat.average_match_position}`
        );
      } else {
        // If student hasn't played in this match, we'll set a default value
        newStat.average_match_position = 0;
        console.log(
          `No match scores found, setting average_match_position to 0`
        );
      }

      // Log what we're about to update
      console.log(`Updating student ${id} with stats:`, newStat);

      // Check if newStat has any properties to update
      if (Object.keys(newStat).length === 0) {
        console.log(`No stats to update for student ${id}`);
        continue;
      }

      // Update the student record and get the result
      const [updatedRows] = await Student.update(newStat, {
        where: { id: id },
      });

      if (updatedRows === 0) {
        console.log(
          `Warning: Student with ID ${id} not found or no changes made`
        );

        // Verify the student exists
        const studentExists = await Student.findByPk(id);
        if (!studentExists) {
          console.log(`Student with ID ${id} does not exist in the database!`);
        } else {
          console.log(
            `Student exists but no rows were updated. Current values might be the same.`
          );
        }
      } else {
        console.log(
          `Successfully updated ${updatedRows} rows for student ${id}`
        );

        // Verify the update by fetching the student again
        const updatedStudent = await Student.findByPk(id);
        console.log(`Updated student values:`, updatedStudent);
      }
    }

    return { success: true, message: "Student stats update process completed" };
  } catch (error) {
    console.log("Error updating student stats:");
    console.error(error);
    return { success: false, message: "Failed to update student stats", error };
  }
};

// export const updateStudentStats = async (
//   studentIds: string[],
//   matchId: number
// ) => {
//   try {
//     for (const id of studentIds) {
//       const newStat: NewStats = {};
//       const studentScores = await StudentScore.findAll({
//         where: { student_id: id },
//       });
//       const playedRounds = studentScores.length;
//       newStat.played_rounds = playedRounds;

//       const totalTime = studentScores.reduce((sum, value) => {
//         return sum + value.time;
//       }, 0);
//       const averageTime = totalTime / playedRounds;
//       newStat.average_time = averageTime;

//       const positionSum = studentScores.reduce((sum, value) => {
//         return sum + value.position;
//       }, 0);
//       const averageHistoricPosition = positionSum / playedRounds;
//       newStat.average_historic_position = averageHistoricPosition;

//       const scores = await StudentScore.findAll({
//         include: [
//           {
//             model: Round,
//             where: { match_id: matchId },
//             attributes: [],
//           },
//         ],
//       });
//       const positionSumMatch = scores.reduce((sum, value) => {
//         return sum + value.position;
//       }, 0);
//       const averageMatchPosition = positionSumMatch / playedRounds;
//       newStat.average_match_position = averageMatchPosition;

//       await Student.update(newStat, {
//         where: {
//           id: id,
//         },
//       });
//     }
//   } catch (error) {
//     console.log("Error updating student stats:");
//     console.error(error);
//   }
// };
