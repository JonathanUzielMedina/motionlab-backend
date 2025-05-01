"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStudentStats = exports.createStudent = exports.getAllStudents = void 0;
const Student_1 = require("../models/Student");
const StudentScore_1 = require("../models/StudentScore");
const Round_1 = require("../models/Round");
const StudentTeamController_1 = require("./StudentTeamController");
const teamController_1 = require("./teamController");
const getAllStudents = async (req, res) => {
    try {
        const data = await Student_1.Student.findAll();
        res.status(200).json({
            message: "Estadisticas de los estudiantes obtenidas correctamente",
            payload: data,
            status: "success",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Hubo problemas en el servidor",
            payload: null,
            status: "error",
        });
    }
};
exports.getAllStudents = getAllStudents;
//crear un estudiante
const createStudent = async (req, res) => {
    const { ids, team_id } = req.body;
    if (!Array.isArray(ids)) {
        res.status(400).json({
            message: "El cuerpo de la solicitud debe ser un arreglo de IDs",
            payload: null,
            status: "error",
        });
        return;
    }
    const studentIds = ids;
    try {
        await Promise.all(studentIds.map(async (id) => {
            const student = await Student_1.Student.findByPk(id);
            if (!student) {
                await Student_1.Student.create({
                    id,
                    played_rounds: 0,
                    average_time: 0,
                    average_match_position: 0,
                    average_historic_position: 0,
                });
            }
        }));
        (0, StudentTeamController_1.registerStudents)(studentIds, team_id);
        (0, teamController_1.changeTeamStatus)(team_id);
        res.status(200).json({
            message: "Estudiantes creados correctamente (si no existían)",
            payload: null,
            status: "success",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Hubo un problema en el servidor",
            payload: null,
            status: "error",
        });
    }
};
exports.createStudent = createStudent;
const updateStudentStats = async (studentIds, matchId) => {
    try {
        for (const id of studentIds) {
            const newStat = {};
            const allStudentScores = await StudentScore_1.StudentScore.findAll({
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
            const matchScores = await StudentScore_1.StudentScore.findAll({
                where: { student_id: id },
                include: [
                    {
                        model: Round_1.Round,
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
                newStat.average_match_position = Math.ceil(positionSumMatch / matchPlayedRounds);
            }
            else {
                newStat.average_match_position = 0;
            }
            if (Object.keys(newStat).length === 0) {
                continue;
            }
            const [updatedRows] = await Student_1.Student.update(newStat, {
                where: { id: id },
            });
        }
    }
    catch (error) {
        console.log("Error updating student stats:");
        console.error(error);
    }
};
exports.updateStudentStats = updateStudentStats;
