import express from 'express';
import RatedController from '../controllers/controller.rated';
import auth from '../middleware/auth';


const router = express.Router();

router.get(`/add`, auth ,RatedController.addRate);

export default router;

