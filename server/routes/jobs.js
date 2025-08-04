import express from 'express';
import JobPost from '../models/JobPost.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all jobs with filters
router.get('/', async (req, res) => {
  try {
    const { skills, location, jobType, experienceLevel, q, page = 1, limit = 10 } = req.query;
    
    let query = { status: 'active' };
    
    // Text search
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Skills filter
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      query.requiredSkills = { $in: skillsArray };
    }
    
    // Location filter
    if (location && location !== 'all') {
      query.location = { $regex: location, $options: 'i' };
    }
    
    // Job type filter
    if (jobType && jobType !== 'all') {
      query.jobType = jobType;
    }
    
    // Experience level filter
    if (experienceLevel && experienceLevel !== 'all') {
      query.experienceLevel = experienceLevel;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const jobs = await JobPost.find(query)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await JobPost.countDocuments(query);

    res.json({
      jobs,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        hasNext: skip + jobs.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id)
      .populate('postedBy', 'name email bio skills')
      .populate('applicants.user', 'name email skills');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ job });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create job
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      requiredSkills,
      budget,
      jobType,
      location,
      company,
      experienceLevel,
      tags,
      deadline
    } = req.body;

    // Validation
    if (!title || !description || !company || !jobType || !experienceLevel) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    if (!budget || !budget.min || !budget.max) {
      return res.status(400).json({ message: 'Budget range is required' });
    }

    const job = new JobPost({
      title,
      description,
      requiredSkills: requiredSkills || [],
      budget,
      jobType,
      location: location || 'Remote',
      company,
      experienceLevel,
      tags: tags || [],
      postedBy: req.user._id,
      deadline: deadline ? new Date(deadline) : null
    });

    await job.save();
    await job.populate('postedBy', 'name email');

    res.status(201).json({
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply to job
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user already applied
    const existingApplication = job.applicants.find(
      app => app.user.toString() === req.user._id.toString()
    );

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    job.applicants.push({
      user: req.user._id,
      appliedAt: new Date()
    });

    await job.save();

    res.json({ message: 'Applied successfully' });
  } catch (error) {
    console.error('Apply job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's posted jobs
router.get('/user/posted', auth, async (req, res) => {
  try {
    const jobs = await JobPost.find({ postedBy: req.user._id })
      .populate('applicants.user', 'name email skills')
      .sort({ createdAt: -1 });

    res.json({ jobs });
  } catch (error) {
    console.error('Get user jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;