import express from 'express';
import RatedController from '../controllers/controller.rated';
import auth from '../middleware/auth';


const router = express.Router();

router.get(`/add`, auth ,RatedController.addRate);

// router.get(`/f`, FilterController.filter);
// router.get(`/qs`, FilterController.quickSearch);
// router.get(`/ef`, FilterController.emptyFilter)


export default router;

