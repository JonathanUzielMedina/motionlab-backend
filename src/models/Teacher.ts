import {
  Table,
  Model,
  Column,
  HasMany,
  PrimaryKey,
  DataType,
} from "sequelize-typescript";
import { Optional } from "sequelize";
import { table } from "console";

interface TeacherAttributes {
  id: string;
  pwd: string;
}

interface TeacherCreationAttributes extends Optional<TeacherAttributes, "id"> {}

@Table({
  tableName: "teachers",
})
export class Teacher extends Model<
  TeacherAttributes,
  TeacherCreationAttributes
> {
  @PrimaryKey
  @Column(DataType.STRING)
  declare id: string;

  @Column(DataType.STRING)
  pwd!: string;
}
