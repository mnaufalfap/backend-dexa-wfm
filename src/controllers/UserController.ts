import { Request, Response } from "express";
import User from "../models/User";
import Helper from "../helpers/Helper";
import PasswordHelper from "../helpers/PasswordHelper";
import Role from "../models/Role";
import Department from "../models/Department";
import Position from "../models/Position";

const Register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, position_id, department_id, email, password, roleId } =
      req.body;

    const hashed = await PasswordHelper.PasswordHashing(password);

    const user = await User.create({
      name,
      position_id,
      department_id,
      email,
      password: hashed,
      role_id: roleId,
      status_id: 1,
    });

    return res
      .status(201)
      .send(Helper.ResponseData(201, "User has been created!", null, user));
  } catch (error: any) {
    return res.status(500).send(Helper.ResponseData(500, "", error, null));
  }
};

const UserLogin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(202)
        .send(
          Helper.ResponseData(202, "Email or password can't empty", null, null)
        );
    }
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res
        .status(202)
        .send(Helper.ResponseData(202, "User not found", null, null));
    }

    const matched = await PasswordHelper.PasswordCompare(
      password,
      user.password
    );

    if (!matched) {
      return res
        .status(202)
        .send(Helper.ResponseData(202, "Password missmatch", null, null));
    }

    const dataUser = {
      name: user.name,
      email: user.email,
      roleId: user.role_id,
      active: user.status_id,
    };
    const token = Helper.GenerateToken(dataUser);
    const refreshToken = Helper.GenerateRefreshToken(dataUser);

    user.access_token = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    const responseUser = {
      id: user.user_id,
      name: user.name,
      email: user.email,
      roleId: user.role_id,
      active: user.status_id,
      token: token,
    };
    return res
      .status(200)
      .send(Helper.ResponseData(200, "Ok", null, responseUser));
  } catch (error: any) {
    return res.status(500).send(Helper.ResponseData(500, "", error, null));
  }
};

const UserLogout = async (req: Request, res: Response): Promise<Response> => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res
        .status(200)
        .send(Helper.ResponseData(200, "User logout", null, null));
    }
    const email = res.locals.userEmail;
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.clearCookie("refreshToken");
      return res
        .status(200)
        .send(Helper.ResponseData(200, "User logout", null, null));
    }

    await user.update({ access_token: null }, { where: { email: email } });
    res.clearCookie("refreshToken");

    return res
      .status(200)
      .send(Helper.ResponseData(200, "User logout", null, null));
  } catch (error: any) {
    return res.status(500).send(Helper.ResponseData(500, "", error, null));
  }
};

const UserUpdate = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { user_id } = req.params;
    const { name, position_id, department_id, email } = req.body;

    const user = await User.findByPk(user_id);

    if (!user) {
      return res
        .status(200)
        .send(Helper.ResponseData(200, "Data not found", null, null));
    }

    user.name = name;
    user.position_id = position_id;
    user.department_id = department_id;
    user.email = email;

    await user.save();
    return res.status(200).send({
      status: 200,
      message: "User has been updated",
      data: user,
    });
  } catch (error: any) {
    return res.status(500).send(Helper.ResponseData(500, "", error, null));
  }
};

const DeleteUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { user_id } = req.params;

    const user = await User.findByPk(user_id);

    if (!user) {
      return res
        .status(200)
        .send(Helper.ResponseData(200, "Data not found", null, null));
    }

    await user.destroy();
    return res.status(200).send({
      status: 200,
      message: "User has been deleted",
      data: user,
    });
  } catch (error: any) {
    return res.status(500).send(Helper.ResponseData(500, "", error, null));
  }
};

const RefreshToken = async (req: Request, res: Response): Promise<Response> => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .send(Helper.ResponseData(401, "Unauthorized", null, null));
    }

    const decodedUser = Helper.ExtractRefreshToken(refreshToken);
    if (!decodedUser) {
      return res
        .status(401)
        .send(Helper.ResponseData(401, "Unauthorized", null, null));
    }

    const token = Helper.GenerateToken({
      name: decodedUser.name,
      email: decodedUser.email,
      roleId: decodedUser.roleId,
      active: decodedUser.status_id,
    });

    const resultUser = {
      name: decodedUser.name,
      email: decodedUser.email,
      roleId: decodedUser.roleId,
      active: decodedUser.active,
      token: token,
    };

    return res
      .status(200)
      .send(Helper.ResponseData(200, "OK", null, resultUser));
  } catch (error: any) {
    return res.status(500).send(Helper.ResponseData(500, "", error, null));
  }
};

const UserDetail = async (req: Request, res: Response): Promise<Response> => {
  try {
    const email = res.locals.userEmail;
    const user = await User.findOne({
      where: {
        email: email,
      },
      include: {
        model: Role,
        attributes: ["role_id", "role_name"],
      },
    });

    if (!user) {
      return res
        .status(404)
        .send(Helper.ResponseData(404, "User not found!", null, null));
    }

    return res.status(200).send(Helper.ResponseData(200, "OK", null, user));
  } catch (error: any) {
    return res.status(500).send(Helper.ResponseData(500, "", error, null));
  }
};

const ListEmployee = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = await User.findAll({
      where: {
        role_id: 2,
        status_id: 1,
      },
      include: [
        {
          model: Department,
          attributes: ["department_id", "department_name"],
        },
        {
          model: Position,
          attributes: ["position_id", "position_name"],
        },
      ],
    });

    if (!user) {
      return res
        .status(404)
        .send(Helper.ResponseData(404, "User not found!", null, null));
    }

    return res.status(200).send(Helper.ResponseData(200, "OK", null, user));
  } catch (error: any) {
    return res.status(500).send(Helper.ResponseData(500, "", error, null));
  }
};

const GetEmployeeById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { user_id } = req.params;
    const user = await User.findAll({
      where: {
        user_id: user_id,
      },
      include: [
        {
          model: Department,
          attributes: ["department_id", "department_name"],
        },
        {
          model: Position,
          attributes: ["position_id", "position_name"],
        },
      ],
    });

    if (!user) {
      return res
        .status(404)
        .send(Helper.ResponseData(404, "User not found!", null, null));
    }

    return res.status(200).send(Helper.ResponseData(200, "OK", null, user));
  } catch (error: any) {
    return res.status(500).send(Helper.ResponseData(500, "", error, null));
  }
};

export default {
  Register,
  UserLogin,
  UserLogout,
  UserUpdate,
  DeleteUser,
  RefreshToken,
  UserDetail,
  ListEmployee,
  GetEmployeeById,
};
