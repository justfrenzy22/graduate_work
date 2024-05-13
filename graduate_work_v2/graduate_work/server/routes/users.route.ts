import express from "express";
import UserController from "../controllers/controller.user";
import auth from "../middleware/auth";
import adminAuth from "../middleware/adminAuth";
import authNext from "../middleware/authNext";

const router = express.Router();

router.post(`/register`, UserController.register);
router.post(`/login`, UserController.login);
router.get(`/logout`, auth, UserController.logout);
router.get(`/verify`, authNext, UserController.verify);
router.get(`/resendVerifyEmail`, auth, UserController.resendVerifyEmail);
router.get(`/deleteAll`, adminAuth, UserController.deleteAll);
router.get("/getScore", auth, UserController.getScore);
router.get(`/load`, auth, UserController.load);
router.get("/getLiked", auth, UserController.getLiked);
router.get("/getWatched", auth, UserController.getWatched);
router.get(`/toggleLiked`, auth, UserController.toggleLiked);
router.get(`/toggleIsWatched`, auth, UserController.toggleIsWatched);
router.get(`/toggleIsPublic`, auth, UserController.toggleIsPublic);
router.get(`/changeRole`, adminAuth, UserController.changeRole);
router.get(`/deleteOne`, auth, UserController.deleteOne);
router.get(`/deleteLiked`, auth, UserController.deleteLiked);
router.get(`/deleteWatched`, auth, UserController.deleteWatched);
router.post(`/update`, auth, UserController.update);
router.get("/accountFinder", UserController.accountFinder);
router.get("/findAll", adminAuth, UserController.findAll);
router.get("/changeRoleAdmin", adminAuth, UserController.changeRoleAdmin);
router.get("/deleteOneAdmin", adminAuth, UserController.deleteOneAdmin);

export default router;
