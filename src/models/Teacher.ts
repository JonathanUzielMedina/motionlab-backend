import { Table, Model, Column, HasMany } from "sequelize-typescript";
import { Optional } from "sequelize";

interface TeacherAttributes {
  id: string;
  pwd: string;
}
