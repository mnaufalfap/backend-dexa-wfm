import { DataTypes, Model, Optional } from "sequelize";
import connection from "../config/dbConnect";

interface DepartmentAttr {
  department_id?: number;
  department_name?: string | null;
}

export interface DepartmentInput
  extends Optional<DepartmentAttr, "department_id"> {}
export interface DepartmentOutput extends Required<DepartmentAttr> {}

class Department
  extends Model<DepartmentAttr, DepartmentInput>
  implements DepartmentAttr
{
  public department_id!: number;
  public department_name!: string;
}

Department.init(
  {
    department_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    department_name: {
      allowNull: true,
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    sequelize: connection,
    underscored: false,
    modelName: "department",
  }
);

export default Department;
