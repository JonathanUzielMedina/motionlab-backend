import { Request, Response, RequestHandler } from "express";
import { Teacher } from "../models/Teacher";


//crear un nuevo profesor
export const createTeacher: RequestHandler = async (
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

    const teacher = { ...req.body };
    const data: Teacher = await Teacher.create(teacher);

    res.status(200).json({
      message: "Profesor creado correctamente",
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

//obtener todos los profesores
export const getAllTeachers: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const data: Teacher[] = await Teacher.findAll();
    res.status(200).json({
      message: "Maestros recuperados exitosamente",
      payload: data,
      status: "success",
    });
  } catch (error) {
    res.status(200).json({
      payload: null,
      message: "Hubo un error en el servidor.",
      status: "error",
    });
  }
};

