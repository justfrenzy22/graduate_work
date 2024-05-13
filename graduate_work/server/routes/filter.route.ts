import express from 'express';
import FilterController from '../controllers/controller.filter';
import authNext from '../middleware/authNext';


const router = express.Router();

router.get(`/discover`, FilterController.discover);
router.get('/quickSearch',authNext, FilterController.quickSearch);
// router.get(`/f`, FilterController.filter);
// router.get(`/qs`, FilterController.quickSearch);
// router.get(`/ef`, FilterController.emptyFilter)


export default router;

