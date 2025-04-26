"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentScoresById = void 0;
const StudentScore_1 = require("../models/StudentScore");
const Student_1 = require("../models/Student");
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
