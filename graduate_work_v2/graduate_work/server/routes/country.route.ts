import express from "express";
import countryController from "../controllers/controller.country";

const router = express.Router();

router.get(`/find`, countryController.findCountry);
router.get(`/pagination`, countryController.countryPagination);

export default router;
