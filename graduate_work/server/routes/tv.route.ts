import express from "express";
import TVController from "../controllers/controller.tv";
import authNext from "../middleware/authNext";

const router = express.Router();

router.get("/details/:id", authNext, TVController.details);
router.get("/preview/:id", authNext, TVController.preview);
router.get("/trailer/:id", TVController.tvTrailer);
router.get("/popular", TVController.popular);
router.get("/trending", TVController.trending);
router.get("/airingToday", TVController.airingToday);
router.get("/findAll", TVController.findAll);
router.get("/deleteAll", TVController.deleteAll);

export default router;
