require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const csv = require('csv-parser');
const xlsx = require('xlsx');

const User = require('./models/User');
const Agent = require('./models/Agent'); // Corrected the import to singular
const Task = require('./models/Task');
const upload = require('./middlewares/upload');

const app = express();
const PORT = process.env.PORT || 5003;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`Connected to MongoDB at ${MONGO_URI}`))
  .catch((err) => console.error('MongoDB connection error:', err));

// --------------------
// User Registration
// --------------------
app.post('/api/register', async (req, res) => {
  console.log("Incoming request to /api/register:", req.body);

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    console.log("User registered successfully:", newUser);

    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// --------------------
// User Login
// --------------------
app.post('/api/login', async (req, res) => {
  console.log("Login attempt with:", req.body);

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });
    console.log("User found in DB:", user);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match status:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const payload = { userId: user._id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// --------------------
// Add Agents
// --------------------
app.post('/api/agents', async (req, res) => {
  const { name, email, mobileNumber, password } = req.body;

  if (!name || !email || !mobileNumber || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ error: 'Agent already exists.' });
    }

    const newAgent = new Agent({ name, email, mobileNumber, password });
    await newAgent.save();
    res.status(201).json({ message: 'Agent added successfully!' });
  } catch (error) {
    console.error('Error adding agent:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// --------------------
// Authentication Middleware
// --------------------
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

// Protected Dashboard Endpoint
app.get('/api/dashboard', authMiddleware, (req, res) => {
  res.json({ message: 'Welcome to the dashboard!', user: req.user });
});

// --------------------
// Upload CSV/Excel and Distribute Tasks
// --------------------
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    let data = [];

    // Process CSV files
    if (req.file.mimetype === 'text/csv') {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          data.push(row);
        })
        .on('end', async () => {
          await distributeTasks(data, res);
        });
    } else {
      // Process Excel files
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      await distributeTasks(data, res);
    }
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to distribute tasks among 5 agents
const distributeTasks = async (data, res) => {
  try {
    const agents = await Agent.find();
    if (agents.length < 5) {
      return res.status(400).json({ error: 'At least 5 agents are required' });
    }

    let distributedTasks = [];
    data.forEach((task, index) => {
      const agent = agents[index % 5]; // Round-robin distribution
      distributedTasks.push({
        firstName: task.FirstName,
        phone: task.Phone,
        notes: task.Notes,
        agentId: agent._id,
      });
    });

    await Task.insertMany(distributedTasks);
    res.json({ message: 'Tasks distributed successfully!' });
  } catch (error) {
    console.error('Task distribution error:', error);
    res.status(500).json({ error: 'Error distributing tasks' });
  }
};

// --------------------
// Fetch Tasks Assigned to an Agent
// --------------------
app.get('/api/agent-tasks/:agentId', async (req, res) => {
  try {
    const tasks = await Task.find({ agentId: req.params.agentId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));