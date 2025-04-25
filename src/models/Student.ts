import {
  Table,
  Model,
  Column,
  HasMany,
  PrimaryKey,
  DataType,
  AllowNull,
  ForeignKey,
  BelongsTo,
  HasOne,
} from "sequelize-typescript";
import { Optional } from "sequelize";
import { StudentTeam } from "./StudentTeam";
import { StudentScore } from "./StudentScore";

interface StudentAttributes {
  id: string;
  played_rounds: number;
  average_time: number;
  average_match_position: number;
  average_historic_position: number;
}

interface StudentCreationAttributes extends Optional<StudentAttributes, "id"> {}

@Table({
  tableName: "students",
  timestamps: false,
})
export class Student extends Model<
  StudentAttributes,
  StudentCreationAttributes
> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
  })
  declare id: string;

  @Column({
    type: DataType.INTEGER,
  })
  played_rounds?: number;

  @Column({
    type: DataType.FLOAT,
  })
  average_time?: number;

  @Column({
    type: DataType.INTEGER,
  })
  average_match_position?: number;

  @Column({
    type: DataType.INTEGER,
  })
  average_historic_position?: number;

  @HasMany(() => StudentTeam)
  studentTeams!: StudentTeam[];

  @HasMany(() => StudentScore)
  student_scores!: StudentScore[];
}
