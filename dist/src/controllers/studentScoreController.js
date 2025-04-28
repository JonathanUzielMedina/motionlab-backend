"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStudentScores = exports.getStudentScoresById = void 0;
const StudentScore_1 = require("../models/StudentScore");
const Student_1 = require("../models/Student");
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
    try {
        const scores = [];
        results.forEach((result) => {
            const score = (result.distance / result.time) * 1000;
            scores.push({
                score: score,
                student_id: result.student_id,
                round_id: roundId,
                time: result.time,
                position: 0,
            });
        });
        await StudentScore_1.StudentScore.bulkCreate(scores, { validate: true });
        const allScores = await StudentScore_1.StudentScore.findAll({
            where: { round_id: roundId },
        });
        const sortedScores = allScores.sort((a, b) => b.score - a.score);
        // Asignamos posición
        await Promise.all(sortedScores.map(async (scoreEntry, index) => {
            scoreEntry.position = index + 1;
            await scoreEntry.save();
        }));
        res.status(200).json({
            message: "Nuevos puntajes calculados correctamente y posiciones actualizadas",
            status: "success",
            payload: null,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error en el servidor " + error,
            status: "error",
            payload: null,
        });
    }
};
exports.createStudentScores = createStudentScores;
