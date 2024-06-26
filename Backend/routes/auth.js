// importing statements
const express = require('express')
const router = express.Router()
const User = require('../models/Users')
var bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const getUser = require('../middleware/getuser');
const VerifyOtp = require('../models/VerifyEmail')

// calling dotenv
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const generateOTP = async ({ _id, email }) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const mailOption = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Hello,</p><p>Here is your email verification code: <b>${otp}</b></p><p><b>The code expires in 1 hour</b><br>BlogSphere team</p>`,
    };

    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    const newOtpVerification = new VerifyOtp({
      userId: _id,
      otp: hashedOtp,
      email: email,
      expireat: Date.now() + 3600000,
    });

    await newOtpVerification.save();
    await transporter.sendMail(mailOption);

    return {
      status: 'PENDING',
      message: 'Verification Email Sent',
      data: {
        userId: _id,
        email: email,
      },
    };
  } catch (error) {
    console.error("Error in generateOTP:", error);
    throw new Error("Failed to generate OTP and send verification email");
  }
};




// Regular expression for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const JWT_SECRET = process.env.JWT_KEY

// routes 1
// Route for user registration
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, image } = req.body;

    // Validate input data
    if (!firstName || !lastName || !email || !password || !image) {
      return res.status(400).json({
        error: true,
        message: "Please enter all required details",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: true,
        message: "Please enter a valid email",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({
        error: true,
        message: "Email has already been used",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      firstname: firstName,
      lastname: lastName,
      email: email,
      password: hashedPassword,
      image: image,
    });

    // Generate and send OTP
    const otpResult = await generateOTP(newUser);

    // Generate JWT token
    const data = {
      user: {
        id: newUser.id
      }
    };
    const token = jwt.sign(data, JWT_SECRET);

    // Send success response
    return res.status(201).json({
      error: false,
      message: 'User registered successfully',
      AccessToken: token,
      otpResult: otpResult  // Optionally include OTP result in response
    });

  } catch (error) {
    console.error("Error in user registration:", error);
    return res.status(500).json({
      error: true,
      message: "Something went wrong!!!",
    });
  }
});


// routes 2
// Verify email Api -----------------------------------------------------------------
router.post('/verifyOTP', async (req, res) => {
  try {
    const { userId, otp } = req.body
    if (!userId || !otp) {
      return res.status(400).json({
        error: true,
        message: "Enter all the data required!!!!",
      });
    }


    const findValidOtp = await VerifyOtp.find({ userId: userId })
    if (findValidOtp.length <= 0) {
      return res.status(400).json({
        error: true,
        message: "looks like there is you have not regitred or you have already verified your email",
      });
    }

    if (findValidOtp.length <= 0) {
      return res.status(400).json({
        error: true,
        message: "Invalid OTP",
      });
    }
    const { expireat, hashedOtp } = findValidOtp[0]

    if (expireat < Date.now()) {
      await VerifyOtp.deleteMany({ userId: userId })
      return res.status(400).json({
        error: true,
        message: "The token has already expired!!",
      });
    }

    const validateOTP = await bcrypt.compare(otp, hashedOtp)

    if (!validateOTP) {
      return res.status(400).json({
        error: true,
        message: "The token has already expired!!",
      });
    }
    await User.updateOne({
      _id: userId
    }, {
      isVerified: true
    })


    await VerifyOtp.deleteMany({userId: userId})


    return res.status(200).json({
      error: false,
      message: "email verified",
    });

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
    });
  }


})



// routes 3
// loin  api no auth required ---------------------------------------------------------- 
router.post('/login', async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: "please enter all details which are required",
    });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: true,
      message: "Please enter a valid email",
    });

  }
  try {
    const user = await User.findOne({ email: email })

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Please regiter first!!!",
      });
    }

    const comparepassword = await bcrypt.compare(password, user.password)
    if (!comparepassword) {
      return res.status(400).json({
        error: true,
        message: "Please regiter first!!!",
      });
    }
    const data = {
      user: {
        id: user.id
      }
    }
    const token = jwt.sign(data, JWT_SECRET);
    return res.status(201).json({
      error: false,
      message: 'User Registred successfully',
      AccessToken: token
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: true,
      message: "Something went wrong!!!",
    });
  }
})


// routes 4
// get user detailed auth required ---------------------------------------------------------- 
router.post('/getuser', getUser, async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId).select('-password')

    return res.status(200).json({
      error: false,
      message: "User found",
      user: user
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: true,
      message: "Something went wrong!!!",
    });
  }
})

module.exports = router;