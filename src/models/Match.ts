import {
  Table,
  Model,
  Column,
  HasMany,
  DataType,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Optional } from "sequelize";
import { Teacher } from "./Teacher";
import { Round } from "./Round";
import { Team } from "./Team";

interface MatchAttributes {
  id: number;
  teacher_id: string;
  teams: number;
  members: number;
  rounds_amount: number;
  rpm: number;
  wheel_size: number;
  distance: number;
  code: string;
  active: boolean;
}

interface MatchCreationAttributes extends Optional<MatchAttributes, "id"> {}

@Table({
  tableName: "matches",
  timestamps: false,
})
export class Match extends Model<MatchAttributes, MatchCreationAttributes> {
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  teams!: number;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  members!: number;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  rounds_amount!: number;

  @AllowNull(false)
  @Column({
    type: DataType.FLOAT,
  })
  rpm!: number;

  @AllowNull(false)
  @Column({
    type: DataType.FLOAT,
  })
  wheel_size!: number;

  @AllowNull(false)
  @Column({
    type: DataType.FLOAT,
  })
  distance!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  code!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  active!: boolean;

  @ForeignKey(() => Teacher)
  @Column({
    type: DataType.STRING,
  })
  teacher_id!: string;

  @BelongsTo(() => Teacher, {
    foreignKey: "teacher_id",
    constraints: false,
  })
  teacher!: Teacher;

  @HasMany(() => Round)
  rounds!: Round[];

  @HasMany(() => Team)
  team!: Team[];
}
