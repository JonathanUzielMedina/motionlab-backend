"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/*
Se modificó la modificación al comentar la conexión de Postgres
y habilitar la conexión a una BB.DD. local de MySQL.
*/
const connection = new sequelize_typescript_1.Sequelize(//process.env.DB_URL as string,
{
    /*
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    */
    database: "motionlab",
    dialect: "mysql",
    username: "motionlab_user",
    password: "MotionLab2576",
    storage: ":memory:",
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
        console.log("Conexión a la base de datos establecida correctamente.");
        await connection.sync({ alter: true });
    }
    catch (error) {
        console.log("Error al conectar la base de datos:", error);
    }
}
exports.default = connectionDB;
