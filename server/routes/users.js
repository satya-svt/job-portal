import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, bio, linkedinUrl, skills, walletAddress, location, experience } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl;
    if (skills) updateData.skills = skills;
    if (walletAddress !== undefined) updateData.walletAddress = walletAddress;
    if (location !== undefined) updateData.location = location;
    if (experience) updateData.experience = experience;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Connect wallet address to user
router.post('/connect-wallet', async (req, res) => {
  try {
    const { email, walletAddress } = req.body;

    if (!email || !walletAddress) {
      return res.status(400).json({ message: 'Email and wallet address are required' });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { walletAddress },
      { new: true, upsert: true }
    ).select('-password');

    res.status(200).json({ message: 'Wallet connected successfully', user });
  } catch (error) {
    console.error('Wallet connect error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search users
router.get('/search', async (req, res) => {
  try {
    const { q, skills } = req.query;
    let query = {};

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } }
      ];
    }

    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      query.skills = { $in: skillsArray };
    }

    const users = await User.find(query)
      .select('-password')
      .limit(20)
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
