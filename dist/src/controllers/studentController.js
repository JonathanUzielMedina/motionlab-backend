"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStudentStats = exports.createStudent = exports.getAllStudents = void 0;
const Student_1 = require("../models/Student");
const StudentScore_1 = require("../models/StudentScore");
const Round_1 = require("../models/Round");
//obtener todos los estudiantes
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
    if (!Array.isArray(req.body)) {
        res.status(400).json({
            message: "El cuerpo de la solicitud debe ser un arreglo de IDs",
            payload: null,
            status: "error",
        });
        return;
    }
    const studentIds = req.body;
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
        const rounds = await Round_1.Round.findAll({
            where: { match_id: matchId },
        });
        const roundIds = rounds.map((r) => r.dataValues.id);
        for (const student_id of studentIds) {
            const allScores = await StudentScore_1.StudentScore.findAll({
                where: { student_id: student_id },
            });
            const matchScores = await StudentScore_1.StudentScore.findAll({
                where: {
                    student_id: student_id,
                    round_id: roundIds,
                },
            });
            const played_rounds = allScores.length;
            // Get total time with proper data access and validation
            const total_time = allScores.reduce((acc, score) => {
                const time = score.dataValues.time || 0;
                return acc + parseFloat(time.toString());
            }, 0);
            // Calculate average time with validation
            const average_time = played_rounds > 0 ? total_time / played_rounds : 0;
            // Get total historic position with proper data access and validation
            const total_historic_position = allScores.reduce((acc, score) => {
                const position = score.dataValues.position || 0;
                return acc + parseInt(position.toString(), 10);
            }, 0);
            // Calculate average historic position with validation
            const average_historic_position = played_rounds > 0 ? total_historic_position / played_rounds : 0;
            // Get total match position with proper data access and validation
            const total_match_position = matchScores.reduce((acc, score) => {
                const position = score.dataValues.position || 0;
                return acc + parseInt(position.toString(), 10);
            }, 0);
            // Calculate average match position with validation
            const average_match_position = matchScores.length > 0 ? total_match_position / matchScores.length : 0;
            // Check and handle NaN values before updating
            await Student_1.Student.update({
                played_rounds,
                average_time: isNaN(average_time) ? 0 : average_time,
                average_historic_position: isNaN(average_historic_position)
                    ? 0
                    : Math.round(average_historic_position * 100) / 100,
                average_match_position: isNaN(average_match_position)
                    ? 0
                    : Math.round(average_match_position * 100) / 100,
            }, { where: { id: student_id } });
        }
    }
    catch (error) {
        console.log("Error updating student stats:");
        console.error(error);
    }
};
exports.updateStudentStats = updateStudentStats;
