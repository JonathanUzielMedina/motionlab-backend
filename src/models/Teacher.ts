import {
  Table,
  Model,
  Column,
  HasMany,
  PrimaryKey,
  DataType,
  AllowNull,
} from "sequelize-typescript";
import { Optional } from "sequelize";

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
  @Column({
    type: DataType.STRING,
  })
  declare id: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  pwd!: string;
}
