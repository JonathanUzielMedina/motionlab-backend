import { Sequelize } from "sequelize-typescript";
import { Match } from "../models/Match";
import { Round } from "../models/Round";
import { Student } from "../models/Student";
import { StudentScore } from "../models/StudentScore";
import { StudentTeam } from "../models/StudentTeam";
import { Teacher } from "../models/Teacher";
import { Team } from "../models/Team";
import { TeamScore } from "../models/TeamScore";
import { TeamStats } from "../models/TeamStats";

const connection = new Sequelize({
  database: "motionlab_db",
  dialect: "mysql",
  username: "root",
  password: "C4rl0s2005!", //C4rl0s2005!
  host: "localhost",
  port: 3306,
  models: [
    Match,
    Round,
    Student,
    StudentScore,
    StudentTeam,
    Teacher,
    Team,
    TeamScore,
    TeamStats,
  ],
  logging: false,
});

async function connectionDB() {
  try {
    await connection.authenticate();
    console.log("Conexión a MySQL establecida correctamente.");
    await connection.sync({ alter: true });
  } catch (error) {
    console.log("Error al conectar la base de datos:", error);
  }
}

export default connectionDB;
