import { Router } from "express";
import { getAllStudents,createStudent } from "../controllers/studentController";

const studentRouter: Router = Router();

studentRouter.get("/", getAllStudents)
studentRouter.post("/", createStudent)

export default studentRouter;
