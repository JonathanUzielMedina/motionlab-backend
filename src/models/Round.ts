import {
  Table,
  Model,
  Column,
  DataType,
  AllowNull,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { Optional } from "sequelize";
import { Match } from "./Match";
import { TeamScore } from "./TeamScore";
import { StudentScore } from "./StudentScore";

interface RoundAttributes {
  id: number;
  match_id: number;
}

interface RoundCreationAttributes extends Optional<RoundAttributes, "id"> {}

@Table({
  tableName: "rounds",
})
export class Round extends Model<RoundAttributes, RoundCreationAttributes> {

  @ForeignKey(() => Match)
  @Column({
    type: DataType.INTEGER,
  })
  match_id!: number;

  @BelongsTo(() => Match, {
    foreignKey: "match_id",
    constraints: false,
  })
  match!: Match;

  @HasMany(() => TeamScore)
  team_scores!: TeamScore[];

  @HasMany(() => StudentScore)
  student_scores!: StudentScore[];
}
