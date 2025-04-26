import { Request, Response, RequestHandler } from "express";
import { Teacher } from "../models/Teacher";

export const teacherAuthentication: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id, pwd } = req.body;

  try {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      res.status(500).json({
        message: "Este profesor no existe en la base de datos",
      });
      return;
    }

    const password = teacher.getDataValue("pwd");

    if (pwd !== password) {
      res.status(500).json({
        message: "Contraseña incorrecta",
      });
      return;
    }

    res.status(200).json({
      message: "LogIn realizado de forma correcta. Bienvenido.",
      payload: id,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: "La solicitud no se proceso adecuadamente",
      payload: null,
      status: "error",
    });
  }
};
