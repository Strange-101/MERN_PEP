import Confession from '../models/Confession.js';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const createSchema = z.object({
  text: z.string().min(1).max(500),
  secretCode: z.string().min(4),
});

// @desc    Create a confession
// @route   POST /api/confessions
// @access  Private
export const createConfession = async (req, res) => {
  try {
    const validatedData = createSchema.parse(req.body);
    const confession = await Confession.create({
      text: validatedData.text,
      secretCodeHash: validatedData.secretCode, // Mongoose pre-save hook will hash this
      userId: req.user._id,
    });
    res.status(201).json(confession);
  } catch (error) {
    res.status(400).json({ message: error.errors || error.message });
  }
};

// @desc    Get all confessions
// @route   GET /api/confessions
// @access  Public
export const getConfessions = async (req, res) => {
  try {
    // All confessions should be displayed on the home page[cite: 13].
    const confessions = await Confession.find().sort({ createdAt: -1 });
    res.status(200).json(confessions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a confession
// @route   PUT /api/confessions/:id
// @access  Private
export const updateConfession = async (req, res) => {
  try {
    const { text, secretCode } = req.body;
    const confession = await Confession.findById(req.params.id);

    if (!confession) return res.status(404).json({ message: 'Confession not found' });
    
    // Must be verified before update or delete.
    const isMatch = await confession.matchSecretCode(secretCode);
    if (!isMatch) {
      // If wrong code is entered, show error message.
      return res.status(401).json({ message: 'Invalid secret code' }); 
    }

    confession.text = text || confession.text;
    const updatedConfession = await confession.save();
    res.status(200).json(updatedConfession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a confession
// @route   DELETE /api/confessions/:id
// @access  Private
export const deleteConfession = async (req, res) => {
  try {
    const { secretCode } = req.body;
    const confession = await Confession.findById(req.params.id);

    if (!confession) return res.status(404).json({ message: 'Confession not found' });

    const isMatch = await confession.matchSecretCode(secretCode);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid secret code' });
    }

    await confession.deleteOne();
    res.status(200).json({ message: 'Confession removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    React to a confession
// @route   POST /api/confessions/:id/react
// @access  Public
export const reactToConfession = async (req, res) => {
  try {
    const { type } = req.body; // 'like', 'love', or 'laugh'
    const validReactions = ['like', 'love', 'laugh'];

    if (!validReactions.includes(type)) {
      return res.status(400).json({ message: 'Invalid reaction type' });
    }

    const confession = await Confession.findById(req.params.id);
    if (!confession) return res.status(404).json({ message: 'Confession not found' });

    confession.reactions[type] += 1;
    await confession.save();
    
    res.status(200).json(confession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyConfessions = async (req, res) => {
  try {
    const confessions = await Confession.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(confessions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getConfessionById = async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);
    if (!confession) return res.status(404).json({ message: 'Confession not found' });
    res.status(200).json(confession);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};