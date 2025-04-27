"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Match_1 = require("../models/Match");
const Round_1 = require("../models/Round");
const Student_1 = require("../models/Student");
const StudentScore_1 = require("../models/StudentScore");
const StudentTeam_1 = require("../models/StudentTeam");
const Teacher_1 = require("../models/Teacher");
const Team_1 = require("../models/Team");
const TeamScore_1 = require("../models/TeamScore");
const TeamStats_1 = require("../models/TeamStats");
const connection = new sequelize_typescript_1.Sequelize({
    database: process.env.DB_NAME,
    dialect: "mysql",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: 5432,
    models: [
        Match_1.Match,
        Round_1.Round,
        Student_1.Student,
        StudentScore_1.StudentScore,
        StudentTeam_1.StudentTeam,
        Teacher_1.Teacher,
        Team_1.Team,
        TeamScore_1.TeamScore,
        TeamStats_1.TeamStats,
    ],
    logging: false,
});
async function connectionDB() {
    try {
        await connection.authenticate();
        console.log("Conexión a MySQL establecida correctamente.");
        await connection.sync({ alter: true });
    }
    catch (error) {
        console.log("Error al conectar la base de datos:", error);
    }
}
exports.default = connectionDB;
