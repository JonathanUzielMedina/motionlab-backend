"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTeachers = exports.createTeacher = void 0;
const Teacher_1 = require("../models/Teacher");
//crear un nuevo profesor
const createTeacher = async (req, res) => {
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
        const data = await Teacher_1.Teacher.create(teacher);
        res.status(200).json({
            message: "Profesor creado correctamente",
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
exports.createTeacher = createTeacher;
//obtener todos los profesores
const getAllTeachers = async (req, res) => {
    try {
        const data = await Teacher_1.Teacher.findAll();
        res.status(200).json({
            message: "Maestros recuperados exitosamente",
            payload: data,
            status: "success",
        });
    }
    catch (error) {
        res.status(200).json({
            payload: null,
            message: "Hubo un error en el servidor.",
            status: "error",
        });
    }
};
exports.getAllTeachers = getAllTeachers;
