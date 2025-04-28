import { Request, Response, RequestHandler } from "express";
import { Student } from "../models/Student";
import { StudentScore } from "../models/StudentScore";

//obtener todos los estudiantes
export const getAllStudents: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const data: Student[] = await Student.findAll();
    res.status(200).json({
      message: "Estadisticas de los estudiantes obtenidas correctamente",
      payload: data,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: "Hubo problemas en el servidor",
      payload: null,
      status: "error",
    });
  }
};

//crear un estudiante
export const createStudent: RequestHandler = async (
  req: Request,
  res: Response
) => {
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
    const data: Student = await Student.create(student);

    res.status(200).json({
      message: "Estudiante creado correctamente",
      payload: data,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: "Hubo un problema en el servidor",
      payload: null,
      status: "error",
    });
  }
};
