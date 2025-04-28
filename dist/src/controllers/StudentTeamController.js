"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerStudents = exports.getStudentTeamById = void 0;
const StudentTeam_1 = require("../models/StudentTeam");
const Student_1 = require("../models/Student");
const Team_1 = require("../models/Team");
const getStudentTeamById = async (req, res) => {
    try {
        const { id } = req.params;
        const rawData = await StudentTeam_1.StudentTeam.findAll({
            where: {
                id_team: id,
            },
            include: [
                {
                    model: Student_1.Student,
                },
                {
                    model: Team_1.Team,
                },
            ],
        });
        const data = rawData.map((element) => ({
            studentId: element.student.id,
            teamId: element.team.id,
        }));
        res.status(200).json({
            message: "Estudiantes del equipo obtenidos exitosamente",
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
exports.getStudentTeamById = getStudentTeamById;
// Hay que juntar esta con la de create student
const registerStudents = async (req, res) => {
    const { student_ids, team_id } = req.body;
    try {
        student_ids.forEach(async (id) => {
            const newStudentTeam = await StudentTeam_1.StudentTeam.create({
                id_student: id,
                id_team: team_id,
            });
        });
        res.status(200).json({
            message: "Alumnos asignados correctamente a un equipo",
            status: "Success",
            payload: null,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error en el servidor" + error,
            status: "Error",
            payload: null,
        });
    }
};
exports.registerStudents = registerStudents;
