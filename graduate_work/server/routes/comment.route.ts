import express from "express";
import CommentController from "../controllers/controller.comment";
import auth from "../middleware/auth";

const router = express.Router();


router.get("/add", auth,CommentController.addComment);
router.get("/reply", auth, CommentController.replyComment);
router.get('/viewMore', auth, CommentController.viewMore);
router.get('/delete', auth, CommentController.deleteComment);

export default router;
