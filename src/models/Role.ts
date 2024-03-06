import { DataTypes, Model, Optional } from "sequelize";
import connection from "../config/dbConnect";

interface RoleAttr {
  role_id?: number;
  role_name?: string | null;
  description?: string | null;
}

export interface RoleInput extends Optional<RoleAttr, "role_id"> {}
export interface RoleOutput extends Required<RoleAttr> {}

class Role extends Model<RoleAttr, RoleInput> implements RoleAttr {
  public role_id!: number;
  public role_name: any;
  public description!: string;
}

Role.init(
  {
    role_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    role_name: {
      allowNull: true,
      type: DataTypes.STRING,
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
    modelName: "user_role",
  }
);

export default Role;
