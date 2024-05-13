import express from "express";
import movieController from "../controllers/controller.movie";
import authNext from "../middleware/authNext";

const router = express.Router();

router.get("/details/:id", authNext, movieController.details);
router.get("/preview/:id", authNext, movieController.preview);
router.get("/trailer/:id", movieController.movieTrailer);
router.get("/popular", movieController.popular);
router.get("/trending", movieController.trending);
router.get("/nowPlaying", movieController.nowPlaying);
router.get("/findAll", movieController.findAll);
router.get("/deleteAll", movieController.deleteAll);

export default router;
