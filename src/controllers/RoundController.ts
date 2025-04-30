import { Request, Response, RequestHandler } from "express";
import { Round } from "../models/Round";
import { TeamScore } from "../models/TeamScore";
import { StudentScore } from "../models/StudentScore";

export const getAllRounds: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const rounds = await Round.findAll({
      include: [
        {
          model: TeamScore,
          as: "team_scores",
        },
        {
          model: StudentScore,
          as: "student_scores",
        },
      ],
    });

    res.status(200).json({
      message: "Rondas obtenidas exitosamente",
      payload: rounds,
      status: "success",
    });
  } catch (error) {
    console.error("Error al obtener las rondas:", error);
    res.status(500).json({
      message: "Error en el servidor",
      payload: null,
      status: "error",
    });
  }
};

export const getRoundById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const round = await Round.findByPk(id, {
      include: [
        {
          model: TeamScore,
          as: "team_scores",
        },
        {
          model: StudentScore,
          as: "student_scores",
        },
      ],
    });

    if (!round) {
      res.status(404).json({
        message: "Ronda no encontrada",
        payload: null,
        status: "error",
      });
      return;
    }

    res.status(200).json({
      message: "Ronda obtenida exitosamente",
      payload: round,
      status: "success",
    });
  } catch (error) {
    console.error("Error al obtener la ronda:", error);
    res.status(500).json({
      message: "Error en el servidor",
      payload: null,
      status: "error",
    });
  }
};

export const createRound: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { match_id } = req.body;
    const newRound = await Round.create({ match_id });

    res.status(201).json({
      message: "Ronda creada exitosamente",
      payload: newRound,
      status: "success",
    });
  } catch (error) {
    console.error("Error al crear la ronda:", error);
    res.status(500).json({
      message: "Error en el servidor",
      payload: null,
      status: "error",
    });
  }
};

export const getMostRecentRound: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const lastRound = await Round.findOne({
      order: [["id", "DESC"]],
    });
    if (!lastRound) {
      return;
    }
    res.status(200).json({
      message: "Ronda obtenida correctamente",
      status: "success",
      payload: lastRound.dataValues,
    });
  } catch (error) {
    res.status(500).json({
      message: "Problemas en el servidor: " + error,
      status: "error",
      payload: null,
    });
  }
};
