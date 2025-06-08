 
const User = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
 
dotenv.config();

const secretKey = process.env.secretKey || 'asdfghjkl';
const otpStore = new Map();

 
exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password, gender, age } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.email,
        pass: process.env.pass,
      },
    });

    await transporter.sendMail({
      from: process.env.email,
      to: email,
      subject: 'TaskManagerPro - OTP for Signup',
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    });

    otpStore.set(email, {
      otp,
      expires: Date.now() + 10 * 60 * 1000,
      userData: { name, email, phone, password: hashedPassword, gender, age, role: 'user' },
    });

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const stored = otpStore.get(email);
    if (!stored || stored.otp !== otp || Date.now() > stored.expires) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const { firstname, lastname, phone, password, gender, age, role } = stored.userData;
    const user = new User({ firstname, lastname, email, phone, password, age, role });
    await user.save();

    otpStore.delete(email);

    const token = jwt.sign({ _id: user._id, email: user.email, role: user.role }, secretKey, {
      expiresIn: '7d',
    });

    console.log('Verify OTP - Token generated:', token, 'Role:', user.role);

    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ message: 'Invalid credentials' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

//     const token = jwt.sign({ _id: user._id, email: user.email, role: user.role }, secretKey, {
//       expiresIn: '7d',
//     });

//     console.log('Login - Token generated:', token, 'Role:', user.role);

//     res.json({
//       token,
//       user: {
//         _id: user._id,
//         email: user.email,
//         firstname: user.firstname,
//         lastname: user.lastname,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
 
    if (user.isDisabled) {
      return res.status(403).json({ message: 'Account is disabled. Please contact Admin.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ _id: user._id, email: user.email, role: user.role }, secretKey, {
      expiresIn: '7d',
    });

    console.log('Login - Token generated:', token, 'Role:', user.role);

    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




// const User = require('../models/usermodel');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');

// const secretKey = process.env.secretKey || 'asdfghjkl';
// const otpStore = new Map();

 
// const generateToken = (user) => {
//   return jwt.sign({ _id: user._id, email: user.email, role: user.role }, secretKey, {
//     expiresIn: '7d',
//   });
// };

 
// exports.signup = async (req, res) => {
//   var response = {};
//   try {
//     const { name, email, phone, password ,gender} = req.body;
//     console.log('signup body',req.body)
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: 'Email already registered' });
  
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
//     otpStore.set(email, {
//       otp,
//       expires: Date.now() + 10 * 60 * 1000,
//       userData: { name, email, phone, password: hashedPassword, role: 'user',gender },
//     });
  
//     console.log('OTP:', otp);  
//     response.status = true;
//     response.message = 'OTP sent to your email';
//     response.data = { otp }; 
//     res.status(200).json(response);
//   } catch (error) {
//     console.error('Error during signup:', error);
//     response.status = false;
//     response.message = 'Error during signup', error.message;
//     response.data = [];
//     res.status(500).json(response);
    
//   }
// };

 
// exports.verifyOtp = async (req, res) => {
//   var response = {};
//   try {
//     const { email, otp } = req.body;
//     console.log('verifyotp body',req.body)
//     const stored = otpStore.get(email);
  
//     if (!stored || stored.otp !== otp || Date.now() > stored.expires) {
//       return res.status(400).json({ message: 'Invalid or expired OTP' });
//     }
  
//     const user = new User(stored.userData);
//     await user.save();
//     otpStore.delete(email);
  
//     const token = generateToken(user);
//     res.json({
//       token,
//       user: { _id: user._id, name: user.name, email: user.email, role: user.role },
//     });
//   } catch (error) {
//     console.error('Error during OTP verification:', error);
//     response.status = false;
//     response.message = 'Server error';
//     response.data = [];
//     res.status(500).json(response);
//   }
// };

 
// exports.login = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) return res.status(401).json({ message: 'Invalid credentials' });

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

//   const token = generateToken(user);
//   res.json({
//     token,
//     user: { _id: user._id, name: user.name, email: user.email, role: user.role },
//   });
// };
  