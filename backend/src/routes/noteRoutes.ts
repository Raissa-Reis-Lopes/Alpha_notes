import { Router } from "express";
import * as noteController from "../controllers/noteController"
import { auth } from "../middlewares/auth";

const router: Router = Router()

router.get("/", auth, noteController.getAllNotes);
router.get("/:noteId", auth, noteController.getNoteById);
router.post("/search", auth, noteController.searchNotesByQuery) //obs: A query virá no body da requisição!
router.post("/", auth, noteController.createNote);
router.put("/:noteId", auth, noteController.updateNote);
router.delete("/:noteId", auth, noteController.deleteNote);

export default router;