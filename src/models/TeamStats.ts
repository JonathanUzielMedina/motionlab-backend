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
import { Team } from "./Team";

interface TeamStatsAttributes {
  team_id: number;
  played_rounds: number;
  average_time: number;
  average_position: number;
}

interface TeamStatsCreationAttributes extends TeamStatsAttributes {}

@Table({
  tableName: "team_stats",
  timestamps: false,
})
export class TeamStats extends Model<
  TeamStatsAttributes,
  TeamStatsCreationAttributes
> {
  @Column({
    type: DataType.INTEGER,
  })
  played_rounds?: number;

  @Column({
    type: DataType.INTEGER,
  })
  average_time?: number;

  @Column({
    type: DataType.INTEGER,
  })
  average_position?: number;

  @ForeignKey(() => Team)
  @Column(DataType.INTEGER)
  team_id!: number;

  @BelongsTo(() => Team)
  team!: Team;
}
