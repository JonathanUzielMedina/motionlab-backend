import {
  Table,
  Model,
  Column,
  DataType,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Optional } from "sequelize";
import { Match } from "./Match";

interface RoundAttributes {
  id: number;
  match_id: number;
  rpm: number;
  wheel_size: number;
  distance: number;
}

interface RoundCreationAttributes extends Optional<RoundAttributes, "id"> {}

@Table({
  tableName: "rounds",
})
export class Round extends Model<RoundAttributes, RoundCreationAttributes> {
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
}
