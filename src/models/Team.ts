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
import { Match } from "./Match";

interface TeamAttributes {
  id: number;
  match_id: number;
  ready: boolean;
}

interface TeamCreationAttributes extends Optional<TeamAttributes, "id"> {}

@Table({
  tableName: "Teams",
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
}
