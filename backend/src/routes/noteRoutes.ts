import { Router } from "express";
import * as noteController from "../controllers/noteController"
import { auth } from "../middlewares/auth";

const router: Router = Router()

// refactor, arrumar as notas, pois nem todas serão necessárias
router.get("/", auth, noteController.getAllNotes);
router.get("/:id", auth, noteController.getNoteById);
router.post("/search", auth, noteController.searchNotesByQuery) //obs: A query virá no body da requisição!
router.post("/", auth, noteController.createNote);
router.put("/:id", auth, noteController.updateNote);
router.delete("/:id", auth, noteController.deleteNote);

export default router;