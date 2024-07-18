const express = require('express');
const Note = require('../models/Note');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret';

const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

router.post('/', authenticate, async (req, res) => {
  const { title, content, tags, backgroundColor } = req.body;
  try {
    const note = new Note({
      userId: req.user.id,
      title,
      content,
      tags,
      backgroundColor
    });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create note.' });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id, isTrashed: false });
    res.status(200).json(notes);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch notes.' });
  }
});

router.get('/archived', authenticate, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id, isArchived: true });
    res.status(200).json(notes);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch archived notes.' });
  }
});

router.get('/trash', authenticate, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id, isTrashed: true });
    res.status(200).json(notes);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch trashed notes.' });
  }
});

router.get('/tags/:tag', authenticate, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id, tags: req.params.tag, isTrashed: false });
    res.status(200).json(notes);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch notes with tag.' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  const { title, content, tags, backgroundColor, isArchived, isTrashed } = req.body;
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, content, tags, backgroundColor, isArchived, isTrashed, updatedAt: Date.now() },
      { new: true }
    );
    res.status(200).json(note);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update note.' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.status(200).json({ message: 'Note deleted successfully.' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete note.' });
  }
});

module.exports = router;
