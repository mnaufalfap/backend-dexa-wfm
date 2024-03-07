import { Request, Response } from "express";
import Helper from "../helpers/Helper";
import Attendance from "../models/Attendance";
import User from "../models/User";

const CreateAttendance = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      user_id,
      date_time_attendance,
      location_attendance,
      photo_attendance,
    } = req.body;

    if (
      !user_id ||
      !date_time_attendance ||
      !location_attendance ||
      !photo_attendance
    ) {
      return res
        .status(400)
        .send(Helper.ResponseData(400, "All fields are required", null, null));
    }

    const attendance = await Attendance.create({
      user_id,
      date_time_attendance,
      location_attendance,
      photo_attendance,
    });

    return res
      .status(201)
      .send(
        Helper.ResponseData(
          201,
          "Attendance created successfully",
          null,
          attendance
        )
      );
  } catch (error: any) {
    return res
      .status(500)
      .send(Helper.ResponseData(500, "Internal Server Error", error, null));
  }
};

const ListAttendance = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const attendance = await Attendance.findAll({
      include: {
        model: User,
        attributes: ["user_id", "name"],
      },
    });
    return res.status(200).send({
      status: 200,
      message: "OK",
      data: attendance,
    });
  } catch (error: any) {
    return res
      .status(500)
      .send(Helper.ResponseData(500, "Internal Server Error", error, null));
  }
};

export default { CreateAttendance, ListAttendance };
