import {
  Table,
  Model,
  Column,
  HasMany,
  DataType,
  AllowNull,
  ForeignKey,
  BelongsTo,
  HasOne,
} from "sequelize-typescript";
import { Optional } from "sequelize";
import { Match } from "./Match";
import { TeamScore } from "./TeamScore";
import { TeamStats } from "./TeamStats";
import { StudentTeam } from "./StudentTeam";

interface TeamAttributes {
  id: number;
  match_id: number;
  ready: boolean;
}

interface TeamCreationAttributes extends Optional<TeamAttributes, "id"> {}

@Table({
  tableName: "teams",
  timestamps: false,
})
export class Team extends Model<TeamAttributes, TeamCreationAttributes> {
  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  ready!: boolean;

  @ForeignKey(() => Match)
  @Column({
    type: DataType.INTEGER,
  })
  match_id!: number;

  @BelongsTo(() => Team, {
    foreignKey: "match_id",
    constraints: false,
  })
  match!: Match;

  @HasMany(() => TeamScore)
  team_scores!: TeamScore[];

  @HasOne(() => TeamStats)
  team_stats!: TeamStats;

  @HasMany(() => StudentTeam, { onDelete: "CASCADE" })
  studentTeams!: StudentTeam[];
}
