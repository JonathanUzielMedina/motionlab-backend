"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllStudentScores = exports.createStudentScores = exports.getStudentScoresById = exports.getStudentScoreByRound = void 0;
const StudentScore_1 = require("../models/StudentScore");
const Student_1 = require("../models/Student");
const Round_1 = require("../models/Round");
const studentController_1 = require("./studentController");
const Match_1 = require("../models/Match");
const getStudentScoreByRound = async (req, res) => {
    try {
        const studentScores = await StudentScore_1.StudentScore.findAll({
            where: {
                round_id: req.params,
            },
        });
        res.status(200).json({
            message: "Scores obtenidos correctamente",
            status: "succes",
            payload: studentScores,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error en el servidor",
            payload: null,
            status: "error",
        });
    }
};
exports.getStudentScoreByRound = getStudentScoreByRound;
// Obtener los scores de un estudiante por ID de ronda
const getStudentScoresById = async (req, res) => {
    try {
        const { id } = req.params;
        const rawData = await StudentScore_1.StudentScore.findAll({
            where: {
                round_id: id,
            },
            include: [
                {
                    model: Student_1.Student,
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
    }
    catch (error) {
        res.status(500).json({
            message: "Error en el servidor",
            payload: null,
            status: "error",
        });
    }
};
exports.getStudentScoresById = getStudentScoresById;
const createStudentScores = async (req, res) => {
    if (!req.body) {
        res.status(400).json({
            message: "El body estaba vacio",
            status: "error",
            payload: null,
        });
        return;
    }
    const { results, roundId } = req.body;
    const round = await Round_1.Round.findByPk(roundId, {
        include: [
            {
                model: Match_1.Match,
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
        const scores = [];
        const studentsIds = [];
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
        // Crear los scores iniciales
        await StudentScore_1.StudentScore.bulkCreate(scores, { validate: true });
        // Obtener todos los scores para este round específico
        const allScores = await StudentScore_1.StudentScore.findAll({
            where: { round_id: roundId },
        });
        // Ordenar scores de mayor a menor (el más alto primero)
        const sortedScores = [...allScores].sort((a, b) => {
            const scoreA = a.dataValues?.score || 0;
            const scoreB = b.dataValues?.score || 0;
            return scoreB - scoreA;
        });
        // Asignar posiciones correctamente (1 para el más alto, 2 para el segundo, etc.)
        for (let i = 0; i < sortedScores.length; i++) {
            await StudentScore_1.StudentScore.update({ position: i + 1 }, // Posición 1 para índice 0, 2 para índice 1, etc.
            {
                where: {
                    id: sortedScores[i].dataValues.id, // Usar el ID único del registro
                },
            });
        }
        // Actualizar estadísticas de estudiantes después de asignar posiciones
        await (0, studentController_1.updateStudentStats)(studentsIds, matchId);
        res.status(200).json({
            message: "Nuevos puntajes calculados correctamente y posiciones actualizadas",
            status: "success",
            payload: null,
        });
    }
    catch (error) {
        console.error("Error en createStudentScores:", error);
        res.status(500).json({
            message: "Error en el servidor " + error,
            status: "error",
            payload: null,
        });
    }
};
exports.createStudentScores = createStudentScores;
const deleteAllStudentScores = async (req, res) => {
    try {
        // Eliminamos todos los registros de la tabla StudentScore
        const deletedCount = await StudentScore_1.StudentScore.destroy({
            where: {}, // Esto asegura que se eliminen todos los registros
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
    }
    catch (error) {
        res.status(500).json({
            message: "Hubo un problema al eliminar los registros: " + error,
            status: "error",
            payload: null,
        });
    }
};
exports.deleteAllStudentScores = deleteAllStudentScores;
