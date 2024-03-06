import { DataTypes, Model, Optional } from "sequelize";
import connection from "../config/dbConnect";

interface PositionAttr {
  position_id?: number;
  position_name?: string | null;
  department_id?: number;
  description?: string | null;
}

export interface PositionInput extends Optional<PositionAttr, "position_id"> {}
export interface PositionOutput extends Required<PositionAttr> {}

class Position
  extends Model<PositionAttr, PositionInput>
  implements PositionAttr
{
  public position_id!: number;
  public position_name!: string;
  public department_id!: number;
  public description!: string;
}

Position.init(
  {
    position_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    position_name: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    department_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    description: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
    sequelize: connection,
    underscored: false,
    modelName: "job_position",
  }
);

export default Position;
