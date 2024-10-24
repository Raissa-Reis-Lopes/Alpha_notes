import { Router } from "express";
import * as noteController from "../controllers/noteController"
import { auth } from "../middlewares/auth";

const router: Router = Router()

router.get("/", auth, noteController.getAllNotes);
router.get("/paginated", auth, noteController.getPaginatedNotes);
router.get("/:noteId", auth, noteController.getNoteById);
router.post("/search", auth, noteController.searchNotesByQuery)
router.post("/", auth, noteController.createNote);
router.put("/updateImages", auth, noteController.updateImages);
router.put("/updateUrls", auth, noteController.updateUrls);
router.put("/:noteId", auth, noteController.updateNote);
router.delete("/:noteId", auth, noteController.deleteNote);

export default router;