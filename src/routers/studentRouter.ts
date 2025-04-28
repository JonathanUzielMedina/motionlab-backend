import { Router } from "express";
import { getAllStudents,createStudent, updateStudentStats } from "../controllers/studentController";

const studentRouter: Router = Router();

studentRouter.get("/", getAllStudents)
studentRouter.post("/", createStudent)
studentRouter.patch("/:id", updateStudentStats)

export default studentRouter;
