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

const connection = new Sequelize(
  "postgresql://root:cuxeUrQh5JUH0SOBSfduIQDzPVYJeSWy@dpg-d06po7hr0fns73fsfklg-a.oregon-postgres.render.com/motionlab_db",
  {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
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
  }
);

async function connectionDB() {
  try {
    await connection.authenticate();
    console.log("Conexión a la base de datos establecida correctamente.");
    await connection.sync({ alter: true });
  } catch (error) {
    console.log("Error al conectar la base de datos:", error);
  }
}

export default connectionDB;
