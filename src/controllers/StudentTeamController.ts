import { Request, Response, RequestHandler } from "express";
import { StudentTeam } from "../models/StudentTeam";
import { Student } from "../models/Student";
import { Team } from "../models/Team";

// Hay que juntar esta con la de create student
export const registerStudents = async (
  student_ids: string[],
  team_id: number
) => {
  try {
    student_ids.forEach(async (id: string) => {
      const newStudentTeam = await StudentTeam.create({
        id_student: id,
        id_team: team_id,
      });
    });
  } catch (error) {
    console.log(error)
  }
};

export const getStudentsByTeamId: RequestHandler = async (
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
          model: StudentTeam,
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
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      payload: null,
      status: "error",
    });
  }
};
