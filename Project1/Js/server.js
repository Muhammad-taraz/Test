const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const JWT_SECRET = '9bhla7hyJVaj7cyhqCmbMGVjJZcSaSjqvsqJjrPbf1cb8e7e';

connectDatabase().then(e => console.log("connected successfully")).catch((e)=>console.log(e))
  
  async function connectDatabase(){
  await mongoose.connect("mongodb+srv://taraz:taraz12@todos.g2clqpo.mongodb.net/test?retryWrites=true&w=majority")}


const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String }
});

const User = mongoose.model('User', userSchema);

const authRouter = express.Router();

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', authRouter);


authRouter.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({ email, password: hashedPassword, name });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


authRouter.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
});


authRouter.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Protected route', user: req.userId });
});

function verifyToken(req, res, next) {
  if (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  req.userId = decoded.userId;
  next();
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
