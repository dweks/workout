const express = require("express");
const {
  getNote,
  getNotesBySearch,
  getNotesByGather,
  getNotesByRecent,
  getNotesByPinned,
  deleteNotes,
  createNote,
  togglePinned,
} = require("./controllers/noteController");
const { createTag, getAllTags } = require("./controllers/tagController");

const router = express.Router();

// Getting

// Notes
router.get("/test/:id", getNote);
router.get("/gather", getNotesByGather);
router.get("/search", getNotesBySearch);
router.get("/last", getNotesByRecent);
router.get("/pinned", getNotesByPinned);

// Tags
router.get("/all", getAllTags);

// POST
router.post("/", createNote);
router.post("/tags", createTag);

// DELETE
router.delete("/delete", deleteNotes);

// UPDATE
router.patch("/pinned/:id", togglePinned);

module.exports = router;
