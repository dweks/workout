const Note = require("../models/_noteModel");
const Tag = require("../models/_tagModel");
const mongoose = require("mongoose");

const getNotesBySearch = async (req, res) => {
  try {
    const note = await Note.find({
      $or: [
        { title: new RegExp(".*" + req.query.qry + ".*") },
        { body: new RegExp(".*" + req.query.qry + ".*") },
      ],
    })
      .populate("tags")
      .sort({ createdAt: -1 });

    res.status(200).json(note);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getNotesByGather = async (req, res) => {
  try {
    const note = await Tag.find({
      tag: { $in: JSON.parse(req.query.tags) },
    }).populate({
      path: "notes",
      populate: {
        path: "tags",
        model: "Tag",
      },
    });
    res.status(200).json(note);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getNotesByRecent = async (req, res) => {
  try {
    const note = await Note.find({})
      .populate("tags", "tag")
      .limit(req.query.num)
      .sort({ createdAt: -1 });
    res.status(200).json(note);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// get a single note
const getNote = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such note" });
  }
  const note = await Note.findById(id);
  if (!note) {
    return res.status(404).json({ error: "No such note" });
  }

  res.status(200).json(note);
};

// create new note
const createNote = async (req, res) => {
  const { title, body, emptyTags } = req.body;
  const tags = JSON.parse(req.query.tags);

  try {
    // Create note document with empty tags array, to get note id
    const noteNoTags = await Note.create({ title, body, emptyTags });
    // Create tag docs and/or push note id to them

    await Tag.bulkWrite(
      tags.map((tag) => ({
        updateOne: {
          filter: { tag: tag },
          update: {
            $set: { tag: tag },
            $push: { notes: noteNoTags._id.toString() },
          },
          upsert: true,
        },
      }))
    );

    // Get ids from tags to push to note
    const tagsFound = await Tag.find({ tag: { $in: tags } });
    const tagIds = tagsFound.map((tag) => {
      return tag._id.toString();
    });

    // Add tag ids to note document
    await Note.findByIdAndUpdate(noteNoTags._id, {
      $push: {
        tags: {
          $each: tagIds,
        },
      },
    });

    res.status(200).json(noteNoTags);
  } catch (error) {
    console.log("error in add:", error.message);
    res.status(404).json({ error: error.message });
  }
};

// delete a note
const deleteNotes = async (req, res) => {
  const notes = JSON.parse(req.query.notes);
  const tags = JSON.parse(req.query.tags);
  const note = await Note.deleteMany({ _id: { $in: notes } });
  await Tag.updateMany(
    { _id: { $in: tags } },
    { $pull: { notes: { $in: notes } } }
  );

  if (!note) {
    return res.status(400).json({ error: "No such note" });
  }

  res.status(200).json(note);
};

// update a note
const togglePinned = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid) {
    return res.status(404).json({ error: "No such note" });
  }

  const note = await Note.findByIdAndUpdate(id, [
    { $set: { pinned: { $not: "$pinned" } } },
  ]);

  if (!note) {
    return res.status(400).json({ error: "No update performed" });
  }

  res.status(200).json(note);
};

const getNotesByPinned = async (req, res) => {
  try {
    const note = await Note.find({ pinned: true }).sort({ createdAt: -1 });
    console.log(note)
    res.status(200).json(note);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  getNote,
  getNotesBySearch,
  getNotesByGather,
  getNotesByRecent,
  createNote,
  getNote,
  deleteNotes,
  togglePinned,
  getNotesByPinned,
};
