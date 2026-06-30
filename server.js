const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure directories exist
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'handwriting-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const DB_PATH = path.join(__dirname, 'database.json');

// Helper to read database
function readDatabase() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { chats: [], profiles: [], users: [] };
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    const db = JSON.parse(data);
    if (!db.users) db.users = [];
    if (!db.profiles) db.profiles = [];
    if (!db.chats) db.chats = [];
    return db;
  } catch (error) {
    console.error('Error reading database:', error);
    return { chats: [], profiles: [], users: [] };
  }
}

// Helper to write database
function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing database:', error);
  }
}

// Helper to find or create profile
function getOrCreateProfile(db, email, name = "Default Student") {
  let profile = db.profiles.find(p => p.id === email);
  if (!profile) {
    profile = {
      id: email,
      name: name,
      sessions: 0,
      slant: 5,
      strokeWidth: 2.5,
      letterSpacing: 3,
      jitter: 1,
      wordSpacing: 8,
      ascenderHeight: 1.1,
      descenderHeight: 1.1,
      connectionRatio: 0.4,
      history: []
    };
    db.profiles.push(profile);
    writeDatabase(db);
  }
  return profile;
}

// AUTHENTICATION APIS

// 1. Sign Up
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const db = readDatabase();
  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const newUser = { name, email: email.toLowerCase(), password };
  db.users.push(newUser);
  
  // Initialize user profile
  const profile = getOrCreateProfile(db, email.toLowerCase(), name);
  
  writeDatabase(db);
  
  res.json({ message: 'Registration successful', name, email: email.toLowerCase(), profile });
});

// 2. Log In
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = readDatabase();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const profile = getOrCreateProfile(db, email.toLowerCase(), user.name);

  res.json({ message: 'Login successful', name: user.name, email: email.toLowerCase(), profile });
});


// PROFILE APIS

// Get profile
app.get('/api/profile', (req, res) => {
  const email = (req.query.email || 'default').toLowerCase();
  const db = readDatabase();
  const profile = getOrCreateProfile(db, email, email === 'default' ? 'Guest Student' : 'Student User');
  res.json(profile);
});

// Analyze uploaded handwriting photo (camera snapshot or file upload)
app.post('/api/analyze', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No photo uploaded' });
  }

  const email = (req.body.email || 'default').toLowerCase();
  const fileSize = req.file.size;
  const fileName = req.file.filename;
  
  // Create deterministic features based on file characteristics
  const rawSlant = -15 + ((fileSize % 300) / 10);
  const rawStrokeWidth = 1.5 + ((fileSize % 40) / 10);
  const rawLetterSpacing = 1 + ((fileSize % 60) / 10);
  const rawJitter = 0.5 + ((fileSize % 25) / 10);
  const rawConnectionRatio = 0.1 + ((fileSize % 80) / 100);
  const rawWordSpacing = 5 + ((fileSize % 100) / 10);
  
  const db = readDatabase();
  let profile = getOrCreateProfile(db, email);

  profile.sessions += 1;

  // Integrate with exponential moving average
  const learningRate = 0.4;
  const oldSlant = profile.slant;
  const oldStrokeWidth = profile.strokeWidth;
  const oldLetterSpacing = profile.letterSpacing;
  const oldJitter = profile.jitter;
  const oldConnectionRatio = profile.connectionRatio;
  const oldWordSpacing = profile.wordSpacing;

  profile.slant = parseFloat((oldSlant * (1 - learningRate) + rawSlant * learningRate).toFixed(1));
  profile.strokeWidth = parseFloat((oldStrokeWidth * (1 - learningRate) + rawStrokeWidth * learningRate).toFixed(1));
  profile.letterSpacing = parseFloat((oldLetterSpacing * (1 - learningRate) + rawLetterSpacing * learningRate).toFixed(1));
  profile.jitter = parseFloat((oldJitter * (1 - learningRate) + rawJitter * learningRate).toFixed(1));
  profile.connectionRatio = parseFloat((oldConnectionRatio * (1 - learningRate) + rawConnectionRatio * learningRate).toFixed(2));
  profile.wordSpacing = parseFloat((oldWordSpacing * (1 - learningRate) + rawWordSpacing * learningRate).toFixed(1));

  const newRecord = {
    timestamp: new Date().toISOString(),
    image: `/uploads/${fileName}`,
    slant: profile.slant,
    strokeWidth: profile.strokeWidth,
    letterSpacing: profile.letterSpacing,
    jitter: profile.jitter,
    connectionRatio: profile.connectionRatio,
    rawMetrics: {
      slant: parseFloat(rawSlant.toFixed(1)),
      strokeWidth: parseFloat(rawStrokeWidth.toFixed(1)),
      letterSpacing: parseFloat(rawLetterSpacing.toFixed(1)),
      jitter: parseFloat(rawJitter.toFixed(1)),
      connectionRatio: parseFloat(rawConnectionRatio.toFixed(2))
    }
  };

  profile.history.push(newRecord);
  writeDatabase(db);

  res.json({
    message: 'Handwriting analyzed successfully',
    newSample: newRecord.rawMetrics,
    refinedProfile: {
      slant: profile.slant,
      strokeWidth: profile.strokeWidth,
      letterSpacing: profile.letterSpacing,
      jitter: profile.jitter,
      connectionRatio: profile.connectionRatio,
      wordSpacing: profile.wordSpacing,
      sessions: profile.sessions
    }
  });
});

// Save manual tuning profile tweaks
app.post('/api/profile/update', (req, res) => {
  const { email, slant, strokeWidth, letterSpacing, jitter, connectionRatio, wordSpacing } = req.body;
  const targetEmail = (email || 'default').toLowerCase();
  
  const db = readDatabase();
  const profile = getOrCreateProfile(db, targetEmail);
  
  if (slant !== undefined) profile.slant = parseFloat(slant);
  if (strokeWidth !== undefined) profile.strokeWidth = parseFloat(strokeWidth);
  if (letterSpacing !== undefined) profile.letterSpacing = parseFloat(letterSpacing);
  if (jitter !== undefined) profile.jitter = parseFloat(jitter);
  if (connectionRatio !== undefined) profile.connectionRatio = parseFloat(connectionRatio);
  if (wordSpacing !== undefined) profile.wordSpacing = parseFloat(wordSpacing);
  
  writeDatabase(db);
  res.json({ message: 'Profile updated successfully', profile });
});


// CHAT APIS

// Get chat history
app.get('/api/chats', (req, res) => {
  const email = (req.query.email || 'default').toLowerCase();
  const db = readDatabase();
  const userChats = db.chats.filter(c => c.email === email);
  res.json(userChats);
});

// Submit chat to AI coach
app.post('/api/chats', (req, res) => {
  const { message, email } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message content required' });
  }

  const targetEmail = (email || 'default').toLowerCase();
  const db = readDatabase();
  const profile = getOrCreateProfile(db, targetEmail);
  
  const userMsg = {
    id: Date.now() + '-user',
    sender: 'user',
    text: message,
    timestamp: new Date().toISOString(),
    email: targetEmail
  };

  // Generate automated AI response
  let aiText = "";
  const slant = profile.slant || 5;
  const jitter = profile.jitter || 1.0;
  const connection = profile.connectionRatio || 0.4;
  const sessions = profile.sessions || 0;

  const lowercaseMsg = message.toLowerCase();
  
  if (lowercaseMsg.includes('hello') || lowercaseMsg.includes('hi')) {
    aiText = `Hello! I am your HandScribe AI Penmanship Coach. I study your uploaded samples and help you practice subjects. Looking at your current profile, you have analyzed ${sessions} samples. Your average slant is ${slant}° and stroke jitter is ${jitter}px. How can I assist you with handwriting practice today?`;
  } else if (lowercaseMsg.includes('slant')) {
    aiText = `Your handwriting has a current average slant of ${slant} degrees. A moderate positive slant (5° to 10°) indicates friendly, outgoing communication, while a backwards/negative slant can show reserve. Based on your history, your slant is ${sessions > 1 ? 'stabilizing' : 'still learning'}. Try the generator tool to see how different slant degrees change readability!`;
  } else if (lowercaseMsg.includes('practice') || lowercaseMsg.includes('subject') || lowercaseMsg.includes('french') || lowercaseMsg.includes('math')) {
    aiText = `I recommend practicing using our Subject tabs. Science allows you to write compound molecular formulas, Maths renders equations dynamically with fractions, and French practices ligatures and accents (like é, è, à) which helps test your cursive connection ratio (currently ${Math.round(connection * 100)}%).`;
  } else if (lowercaseMsg.includes('improve') || lowercaseMsg.includes('neat') || lowercaseMsg.includes('ugly')) {
    aiText = `To make your writing cleaner: \n1. Keep your stroke spacing consistent (currently estimated at ${profile.letterSpacing}px).\n2. Maintain consistent line slopes. Your current jitter is ${jitter}px. Focus on keeping horizontal guidelines straight.\n3. Make sure letter ascenders (like h, t) and descenders (like y, g) don't overlap.`;
  } else {
    aiText = `That's interesting! Based on your active writing profile (Slant: ${slant}°, Jitter: ${jitter}px, Connection: ${Math.round(connection * 100)}%), here is a tip: ${
      jitter > 1.8 
        ? "Your strokes show high frequency changes. Try slowing down your drawing motion to stabilize lines." 
        : "You have very clean, steady stroke paths. You can try increasing your cursive connection ratio to write faster."
    } What subject (Science, Maths, French) are you planning to practice next?`;
  }

  const aiMsg = {
    id: (Date.now() + 1) + '-ai',
    sender: 'ai',
    text: aiText,
    timestamp: new Date().toISOString(),
    email: targetEmail
  };

  db.chats.push(userMsg);
  db.chats.push(aiMsg);
  writeDatabase(db);

  res.json({ userMsg, aiMsg });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
