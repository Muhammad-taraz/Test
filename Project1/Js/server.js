const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your_jwt_secret';

connectDatabase().then(e => console.log("connected successfully")).catch((e)=>console.log(e))
  
  async function connectDatabase(){
  await mongoose.connect("mongodb+srv://taraz:taraz12@todos.g2clqpo.mongodb.net/test?retryWrites=true&w=majority")}


// mongoose.connect('mongodb://localhost:27017/auth_demo', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// Define user schema and model
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


authRouter.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
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
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.userId = decoded.userId;
    next();
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
