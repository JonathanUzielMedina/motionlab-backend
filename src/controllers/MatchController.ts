import { Request, Response, RequestHandler } from "express";
import { Match } from "../models/Match";
// Obtener todos los matches
export const getAllMatches: RequestHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const matches = await Match.findAll();
        res.status(200).json({
            message: "Partidas obtenidas exitosamente",
            payload: matches,
            status: "success",
        });
    } catch (error) {
        console.error("Error al obtener las partidas:", error);
        res.status(500).json({
            message: "Error en el servidor",
            payload: null,
            status: "error",
        });
    }
};
// Obtener un match por ID
export const getMatchById: RequestHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        const match = await Match.findByPk(id);
        if (!match) {
            res.status(404).json({
                message: "Partida no encontrada",
                payload: null,
                status: "error",
            });
            return;
        }
        res.status(200).json({
            message: "Partida obtenida exitosamente",
            payload: match,
            status: "success",
        });
    } catch (error) {
        console.error("Error al obtener la partida:", error);
        res.status(500).json({
            message: "Error en el servidor",
            payload: null,
            status: "error",
        });
    }
};
// Obtener matches por ID del profesor
export const getMatchesByTeacherId: RequestHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const { teacherId } = req.params;
        const matches = await Match.findAll({
            where: {
                teacher_id: teacherId,
            }
        });
        res.status(200).json({
            message: "Partidas del profesor obtenidas exitosamente",
            payload: matches,
            status: "success",
        });
    } catch (error) {
        console.error("Error al obtener las partidas del profesor:", error);
        res.status(500).json({
            message: "Error en el servidor",
            payload: null,
            status: "error",
        });
    }
};