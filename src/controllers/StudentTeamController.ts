import { Request, Response, RequestHandler } from "express";
import { StudentTeam } from "../models/StudentTeam";
import { Student } from "../models/Student";
import { Team } from "../models/Team";

// Obtener los estudiantes de un equipo por ID de equipo
export const getStudentTeamById: RequestHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        const rawData: StudentTeam[] = await StudentTeam.findAll({
            where: {
                id_team: id,
            },
            include: [
                {
                    model: Student,
                },
                {
                    model: Team,
                }
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
    } catch (error) {
        res.status(500).json({
            message: "Error en el servidor",
            payload: null,
            status: "error",
        });
    }
};