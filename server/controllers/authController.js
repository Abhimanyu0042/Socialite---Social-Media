const user = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); //jwt is json web token
const { error } = require("../utils/responseWrapper");
const { success } = require("../utils/responseWrapper");
//we will use await if its a asyncronous function

const signupController = async (req, res) => {
  try {
    const { name, email, password, avatar, bio } = req.body;

    if (!email || !password || !name) {
      // return res.status(400).send('All fields are required');
      return res.send(error(400, "All fields are required."));
    }
    const oldUser = await user.findOne({ email });
    if (oldUser) {
      // return res.status(409).send('User is already registered');
      return res.send(error(409, "User is already registered"));
    }
    const hashedPassword = await bcrypt.hash(password, 10); //used to hash password for ethical use that we cant decode it once encoded
    const User = await user.create({
      name,
      email,
      bio,
      avatar :{
        publicId: "abcdefgh",
        url: "https://gravatar.com/avatar/933187bb9c17e4692a1667f081c14950?s=400&d=robohash&r=x"
      },
      password: hashedPassword,
    });

    console.log(User);

    // return res.status(201).json({
    //     User,
    // });

    return res.send(success(201, "User created successfully!"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      // return res.status(400).send('All fields are required');
      return res.send(error(400, "All fields are required"));
    }

    const User = await user.findOne({ email }).select("+password");
    if (!User) {
      // return res.status(404).send('User is not registered');
      return res.send(error(404, "User is not registered"));
    }
    const matched = await bcrypt.compare(password, User.password);
    if (!matched) {
      // return res.status(403).send("Incorrect Password");
      return res.send(error(403, "Incorrect Password"));
    }

    const accessToken = generateAccessToken({ _id: User._id });
    const refreshToken = generateRefreshToken({ _id: User._id });

    res.cookie("jwt", refreshToken, {
      httpOnly: true, //tells that it cant be accessed by any javascript
      secure: true, //it should also run in https
    }); //to save refreshtoken in cookies

    // return res.json({
    //     //User,
    //     accessToken,
    // })

    return res.send(
      success(200, {
        accessToken,
      })
    );
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

//this api will check the refreshToken validity and generate a new access token
const refreshAccessTokenController = async (req, res) => {
  const cookies = req.cookies; //cookies is a raaay with too many cookie
  if (!cookies.jwt) {
    // return res.status(401).send("Refresh token in cookie is required");
    return res.send(error(401, "Refresh token in cookie is required"));
  }
  const refreshToken = cookies.jwt;

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );

    const _id = decoded._id;
    const accessToken = generateAccessToken({ _id });

    // return res.status(201).json({ accessToken});
    return res.send(
      success(201, {
        accessToken,
      })
    );
  } catch (error) {
    console.log(error);
    // return res.status(401).send('Invalid Refresh token');
    return res.send(error(401, "Invalid Refresh token"));
  }
};

const logoutController = async(req,res)=> {
    try {
        res.clearCookie('jwt',{
            httpOnly: true,
            secure: true
        })
        return res.send(success(200,'User logged out'));
    } catch (e) {
        return res.send(error(500, e.message));
        
    }
}

//internal functions
const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "1d",
    });
    console.log(token);
    return token;
  } catch (e) {
    console.log(e);
  }
};

const generateRefreshToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "1y",
    });
    console.log(token);
    return token;
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  signupController,
  loginController,
  refreshAccessTokenController,
  logoutController
};
