import { DataTypes, Model, Optional } from "sequelize";
import connection from "../config/dbConnect";
import User from "./User";

interface AttendanceAttr {
  attendance_id?: number;
  user_id?: number;
  date_time_attendance?: string;
  location_attendance?: string | null;
  photo_attendance?: string | null;
}

export interface AttendanceInput
  extends Optional<AttendanceAttr, "attendance_id"> {}
export interface AttendanceOutput extends Required<AttendanceAttr> {}

class Attendance
  extends Model<AttendanceAttr, AttendanceInput>
  implements AttendanceAttr
{
  public attendance_id!: number;
  public user_id!: number;
  public date_time_attendance!: string;
  public location_attendance!: string;
  public photo_attendance!: string;
}
Attendance.init(
  {
    attendance_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    user_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    date_time_attendance: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    location_attendance: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    photo_attendance: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
    sequelize: connection,
    underscored: false,
    modelName: "attendance",
  }
);

Attendance.belongsTo(User, { foreignKey: "user_id" });

export default Attendance;
