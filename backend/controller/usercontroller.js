const User = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secretKey = process.env.secretKey || 'asdfghjkl';
const otpStore = new Map();

 
const generateToken = (user) => {
  return jwt.sign({ _id: user._id, email: user.email, role: user.role }, secretKey, {
    expiresIn: '7d',
  });
};

 
exports.signup = async (req, res) => {
  var response = {};
  try {
    const { name, email, phone, password ,gender} = req.body;
    console.log('signup body',req.body)
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
    otpStore.set(email, {
      otp,
      expires: Date.now() + 10 * 60 * 1000,
      userData: { name, email, phone, password: hashedPassword, role: 'user',gender },
    });
  
    console.log('OTP:', otp);  
    response.status = true;
    response.message = 'OTP sent to your email';
    response.data = { otp }; 
    res.status(200).json(response);
  } catch (error) {
    console.error('Error during signup:', error);
    response.status = false;
    response.message = 'Error during signup', error.message;
    response.data = [];
    res.status(500).json(response);
    
  }
};

 
exports.verifyOtp = async (req, res) => {
  var response = {};
  try {
    const { email, otp } = req.body;
    console.log('verifyotp body',req.body)
    const stored = otpStore.get(email);
  
    if (!stored || stored.otp !== otp || Date.now() > stored.expires) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
  
    const user = new User(stored.userData);
    await user.save();
    otpStore.delete(email);
  
    const token = generateToken(user);
    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Error during OTP verification:', error);
    response.status = false;
    response.message = 'Server error';
    response.data = [];
    res.status(500).json(response);
  }
};

 
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken(user);
  res.json({
    token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
};
  