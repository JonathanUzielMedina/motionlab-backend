import {
  Table,
  Model,
  Column,
  DataType,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Student } from "./Student";
import { Round } from "./Round";

interface StudentScoreAttributes {
  student_id: string;
  round_id: number;
  score: number;
  time: number;
  position: number;
}

interface StudentScoreCreationAttributes extends StudentScoreAttributes{}

@Table({
  tableName: "student_scores",
  timestamps: true,
  updatedAt: false,
})
export class StudentScore extends Model<StudentScoreAttributes, StudentScoreCreationAttributes>{
  @AllowNull(false)
    @Column({
      type: DataType.INTEGER,
    })
    score!: number;

    @AllowNull(false)
    @Column({
      type: DataType.FLOAT,
    })
    time!: number;

    @AllowNull(false)
    @Column({
      type: DataType.INTEGER,
    })
    position!: number;

    @ForeignKey(() => Student)
    @Column({
      type: DataType.STRING,
    })
    student_id!: string;

    @ForeignKey(() => Round)
    @Column({
      type: DataType.INTEGER,
    })
    round_id!: number;

    @BelongsTo(() => Student, {
      foreignKey: "student_id",
      constraints: false,
    })
    student!: Student;

    @BelongsTo(() => Round, {
      foreignKey: "round_id",
      constraints: false,
    })
    round!: Round;
}
