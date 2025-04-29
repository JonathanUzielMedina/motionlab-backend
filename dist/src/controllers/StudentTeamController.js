"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentsByTeamId = exports.registerStudents = void 0;
const StudentTeam_1 = require("../models/StudentTeam");
// Hay que juntar esta con la de create student
const registerStudents = async (student_ids, team_id) => {
    try {
        student_ids.forEach(async (id) => {
            const newStudentTeam = await StudentTeam_1.StudentTeam.create({
                id_student: id,
                id_team: team_id,
            });
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.registerStudents = registerStudents;
const getStudentsByTeamId = async (req, res) => {
    try {
        const { id } = req.params;
        const rawData = await StudentTeam_1.StudentTeam.findAll({
            where: {
                id_team: id,
            },
            include: [
                {
                    model: StudentTeam_1.StudentTeam,
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
exports.getStudentsByTeamId = getStudentsByTeamId;
