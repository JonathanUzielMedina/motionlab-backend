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
        const data = await Student_1.Student.create(student);
        res.status(200).json({
            message: "Estudiante creado correctamente",
            payload: data,
            status: "success",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Hubo un problema en el servidor",
            payload: null,
            status: "error",
        });
    }
};
exports.createStudent = createStudent;
const updateStudentStats = async (req, res) => {
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
        const rounds = await Round_1.Round.findAll({
            where: { match_id: match_id },
        });
        const roundIds = rounds.map((r) => r.id);
        // 2. Procesar cada estudiante
        for (const student_id of student_ids) {
            // Traer TODOS sus scores
            const allScores = await StudentScore_1.StudentScore.findAll({
                where: { student_id: student_id },
            });
            // Traer SOLO sus scores de las rondas de este match
            const matchScores = await StudentScore_1.StudentScore.findAll({
                where: {
                    student_id: student_id,
                    round_id: roundIds, // Sequelize entiende arrays aquí
                },
            });
            // --- Calcular estadísticas ---
            const played_rounds = allScores.length;
            const total_time = allScores.reduce((acc, score) => acc + score.time, 0);
            const average_time = played_rounds > 0 ? total_time / played_rounds : 0;
            const total_historic_position = allScores.reduce((acc, score) => acc + score.position, 0);
            const average_historic_position = played_rounds > 0 ? total_historic_position / played_rounds : 0;
            const total_match_position = matchScores.reduce((acc, score) => acc + score.position, 0);
            const average_match_position = matchScores.length > 0 ? total_match_position / matchScores.length : 0;
            // 3. Actualizar al estudiante
            await Student_1.Student.update({
                played_rounds,
                average_time,
                average_historic_position,
                average_match_position,
            }, { where: { id: student_id } });
        }
        res.status(200).json({
            status: "success",
            message: "Estadísticas actualizadas exitosamente",
            payload: null,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Error en el servidor " + error,
            payload: null,
        });
    }
};
exports.updateStudentStats = updateStudentStats;
