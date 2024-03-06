import { Request, Response } from "express";
import Role from "../models/Role";

const GetRole = async (req: Request, res: Response): Promise<Response> => {
  try {
    const role = await Role.findAll();
    return res.status(200).send({
      status: 200,
      message: "OK",
      data: role,
    });
  } catch (error: any) {
    if (error != null && error instanceof Error) {
      return res.status(500).send({
        status: 500,
        message: error.message,
        errors: error,
      });
    }

    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      errors: error,
    });
  }
};

const CreateRole = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { role_name, description } = req.body;

    const create = await Role.create({
      role_name,
      description,
    });

    return res.status(201).send({
      status: 201,
      message: "Role has been created!",
      data: create,
    });
  } catch (error: any) {
    if (error != null && error instanceof Error) {
      return res.status(500).send({
        status: 500,
        message: error.message,
        errors: error,
      });
    }

    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      errors: error,
    });
  }
};

const UpdateRole = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { role_id } = req.params;
    const { role_name, description } = req.body;

    const role = await Role.findByPk(role_id);

    if (!role) {
      return res.status(404).send({
        status: 404,
        message: "Data not found",
        data: null,
      });
    }

    role.role_name = role_name;
    role.description = description;

    await role.save();

    return res.status(200).send({
      status: 200,
      message: "Role has been updated!",
      data: role,
    });
  } catch (error: any) {
    if (error != null && error instanceof Error) {
      return res.status(500).send({
        status: 500,
        message: error.message,
        errors: error,
      });
    }

    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      errors: error,
    });
  }
};

const DeleteRole = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { role_id } = req.params;

    const role = await Role.findByPk(role_id);

    console.log(role);

    if (!role) {
      return res.status(404).send({
        status: 404,
        message: "Data not found",
        data: null,
      });
    }

    await role.destroy();

    return res.status(200).send({
      status: 200,
      message: "Role has been deleted!",
      data: null,
    });
  } catch (error: any) {
    if (error != null && error instanceof Error) {
      return res.status(500).send({
        status: 500,
        message: error.message,
        errors: error,
      });
    }

    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      errors: error,
    });
  }
};

const GetRoleById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { role_id } = req.params;

    const role = await Role.findByPk(role_id);

    if (!role) {
      return res.status(404).send({
        status: 404,
        message: "Data not found",
        data: null,
      });
    }

    return res.status(200).send({
      status: 200,
      message: "OK",
      data: role,
    });
  } catch (error: any) {
    if (error != null && error instanceof Error) {
      return res.status(500).send({
        status: 500,
        message: error.message,
        errors: error,
      });
    }

    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      errors: error,
    });
  }
};

export default { GetRole, CreateRole, UpdateRole, DeleteRole, GetRoleById };
