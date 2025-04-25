"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teacherAuthentication = void 0;
const Teacher_1 = require("../models/Teacher");
const teacherAuthentication = async (req, res) => {
    const { id, pwd } = req.body;
    try {
        const teacher = await Teacher_1.Teacher.findByPk(id);
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
        });
    }
    catch (error) {
        res.status(500).json({
            message: "La solicitud no se proceso adecuadamente",
        });
    }
};
exports.teacherAuthentication = teacherAuthentication;
