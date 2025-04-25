import {
  Table,
  Model,
  Column,
  ForeignKey,
  PrimaryKey,
  DataType,
  AllowNull,
  BelongsTo,
} from "sequelize-typescript";
import { Optional } from "sequelize";
import { Student } from "./Student";
import { Team } from "./Team";

interface StudentTeamAttributes {
  id_student: string;
  id_team: number;
}

interface StudentTeamCreationAttributes
  extends Optional<StudentTeamAttributes, "id_student" | "id_team"> {}

@Table({
  tableName: "student_team",
  timestamps: false,
})
export class StudentTeam extends Model<
  StudentTeamAttributes,
  StudentTeamCreationAttributes
> {
  @PrimaryKey
  @ForeignKey(() => Student)
  @Column({
    type: DataType.STRING(9),
  })
  id_student!: string;

  @PrimaryKey
  @ForeignKey(() => Team)
  @Column({
    type: DataType.INTEGER,
  })
  id_team!: number;

  @BelongsTo(() => Student, {
    foreignKey: "id_student",
  })
  student!: Student;

  @BelongsTo(() => Team, {
    foreignKey: "id_team",
  })
  team!: Team;
}
