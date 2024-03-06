import express from "express";

import RoleController from "../controllers/RoleController";
import UserController from "../controllers/UserController";

import UserValidation from "../middleware/validation/UserValidation";
import Authorization from "../middleware/Authorization";
import AttendanceController from "../controllers/AttendanceController";

const router = express.Router();

//Role Admin
router.post(
  "/role",
  Authorization.Authenticated,
  Authorization.Admin,
  RoleController.CreateRole
);
router.post(
  "/role/:role_id",
  Authorization.Authenticated,
  Authorization.Admin,
  RoleController.UpdateRole
);
router.delete(
  "/role/:role_id",
  Authorization.Authenticated,
  Authorization.Admin,
  RoleController.DeleteRole
);

//Role Employee
router.get("/role", Authorization.Authenticated, RoleController.GetRole);
router.get(
  "/role/:role_id",
  Authorization.Authenticated,
  RoleController.GetRoleById
);

//User
router.post(
  "/user/signup",
  UserValidation.RegisterValidation,
  Authorization.Authenticated,
  Authorization.Admin,
  UserController.Register
);
router.post("/user/login", UserController.UserLogin);
router.get("/user/refresh-token", UserController.RefreshToken);
router.get(
  "/user/current-user",
  Authorization.Authenticated,
  UserController.UserDetail
);
router.get(
  "/user/logout",
  Authorization.Authenticated,
  UserController.UserLogout
);
router.post(
  "/user/:user_id",
  Authorization.Authenticated,
  Authorization.Admin,
  UserController.UserUpdate
);
router.delete(
  "/user/:user_id",
  Authorization.Authenticated,
  Authorization.Admin,
  UserController.DeleteUser
);

//User Employee
router.get(
  "/user/list-employee",
  Authorization.Authenticated,
  Authorization.Admin,
  UserController.ListEmployee
);
router.get(
  "/user/list-employee/:user_id",
  Authorization.Authenticated,
  Authorization.Admin,
  UserController.GetEmployeeById
);

//Attendance
router.post(
  "/user/attendance",
  Authorization.Authenticated,
  Authorization.Employee,
  AttendanceController.CreateAttendance
);
router.get(
  "/user/list-attendance",
  Authorization.Authenticated,
  Authorization.Admin,
  AttendanceController.ListAttendance
);

export default router;
