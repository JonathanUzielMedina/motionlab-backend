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
} from "sequelize-typescript";
import { Optional } from "sequelize";
import { Teacher } from "./Teacher";
import { Round } from "./Round";
import { Team } from "./Team";

interface MatchAttributes {
  id: number;
  teacher_id: number;
  teams: number;
  members: number;
  start_time: Date;
  end_time: Date;
}

interface MatchCreationAttributes extends Optional<MatchAttributes, "id"> {}

@Table({
  tableName: "matches",
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

  @Column({
    type: DataType.DATE,
  })
  start_time?: Date;

  @Column({
    type: DataType.DATE,
  })
  end_time?: Date;

  @ForeignKey(() => Teacher)
  @Column({
    type: DataType.INTEGER,
  })
  teacher_id!: number;

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
