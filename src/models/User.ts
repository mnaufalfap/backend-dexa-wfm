import { DataTypes, Model, Optional } from "sequelize";
import connection from "../config/dbConnect";
import Role from "./Role";
import Department from "./Department";
import Position from "./Position";

interface UserAttr {
  user_id?: number;
  name?: string | null;
  position_id?: number | null;
  department_id?: number | null;
  email?: string | null;
  password?: string | null;
  role_id?: number | null;
  phone_number?: string | null;
  address?: string | null;
  status_id?: number | null;
  access_token?: string | null;

  created_at?: Date;
  updated_at?: Date;
}

export interface UserInput extends Optional<UserAttr, "user_id"> {}
export interface UserOutput extends Required<UserAttr> {}

class User extends Model<UserAttr, UserInput> implements UserAttr {
  public user_id!: number;
  public name!: string;
  public position_id!: number;
  public department_id!: number;
  public email!: string;
  public password!: string;
  public role_id!: number;
  public phone_number!: string;
  public address!: string;
  public status_id!: number;
  public access_token!: string;

  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  id: any;
}
User.init(
  {
    user_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    position_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    department_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    email: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    role_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    phone_number: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    address: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
    status_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    access_token: {
      allowNull: true,
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    sequelize: connection,
    underscored: false,
    modelName: "user",
  }
);

User.belongsTo(Role, { foreignKey: "role_id" });
User.belongsTo(Department, { foreignKey: "department_id" });
User.belongsTo(Position, { foreignKey: "position_id" });

export default User;
