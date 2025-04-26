"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllStudents = void 0;
const Student_1 = require("../models/Student");
const getAllStudents = async (req, res) => {
    try {
        const data = await Student_1.Student.findAll();
        res.status(200).json({
            message: "Estadisticas de los estudiantes obtenidas correctamente",
            payload: data,
            status: "success",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Hubo problemas en el servidor",
            payload: null,
            status: "error",
        });
    }
};
exports.getAllStudents = getAllStudents;
