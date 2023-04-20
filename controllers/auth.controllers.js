const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");

const User = db.user;
const Member = db.member;

const secretKey = process.env.JSON_SECRET_KEY;

const registerUser = async (req, res, next) => {
  try {
    const { email, password, refDomain } = req.body;
    console.log(req.body)
    // const refDomain = req.hostname;
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      return res.status(409).json({
        type: "User Exist",
        message: "User with this username/email already exist!",
      });
    }

    const passHash = await bcrypt.hash(password, 10);

    const refactorEmail = email.split(".com")[0];
    const splitEmail = refactorEmail.split("@");
    const _domainUsername = splitEmail[0];
    const _domainEmail = splitEmail[1];
    const domainName = `${_domainUsername}-${_domainEmail}`;
    const newUser = new User({
      domainHeader: domainName,
      email,
      username: _domainUsername,
      passwordHash: passHash,
      refDomain,
    });

    const savedUser = await newUser.save();
    if (savedUser) {
      return res.status(201).json({
        type: "User Created",
        message: "User is created!",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      type: "Server Error",
      message: "Internal server error",
    });
  }
};

const registerMember = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // const refDomain = req.hostname;
    const user = await Member.findOne({ where: { email: email } });
    if (user) {
      return res.status(409).json({
        type: "Member Exist",
        message: "Member with this username/email already exist!",
      });
    }

    const passHash = await bcrypt.hash(password, 10);

    const refactorEmail = email.split(".com")[0];
    const splitEmail = refactorEmail.split("@");
    const _domainUsername = splitEmail[0];
    const newUser = new Member({
      email,
      username: _domainUsername,
      passwordHash: passHash,
    });

    const savedUser = await newUser.save();
    if (savedUser) {
      return res.status(201).json({
        type: "Member Created",
        message: "Member is created!",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      type: "Server Error",
      message: "Internal server error",
    });
  }
};

const loginUser = async (req, res, next) => {
  try {
    let _email = "";
    const { email, password } = req.body;
    if (email) {
      _email = email;
    }
    const user = await User.findOne({
      where: { email: _email }
    });

    if (!user) {
      return res.status(409).json({
        type: "User Not Exist",
        message: "User does not exist with this username/email!",
      });
    }

    // Check password
    const result = await bcrypt.compare(password, user.passwordHash);
    if (!result) {
      return res.status(401).json({
        type: "Wrong Password",
        message: "Password is incorrect!",
      });
    }

    const token = jwt.sign({ id: user.id }, secretKey);
    res.status(200).json({
      type: "Login Successful",
      messasge: "Successfully logged in user",
      token: token,
      user
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      type: "Server Error",
      message: "Internal server error",
    });
  }
};

const loginMember = async (req, res, next) => {
  try {
    let _email = "";
    const { email, password } = req.body;
    if (email) {
      _email = email;
    }
    const user = await Member.findOne({
      where: { email: _email }
    });

    if (!user) {
      return res.status(409).json({
        type: "Member Not Exist",
        message: "Member does not exist with this username/email!",
      });
    }

    // Check password
    const result = await bcrypt.compare(password, user.passwordHash);
    if (!result) {
      return res.status(401).json({
        type: "Wrong Password",
        message: "Password is incorrect!",
      });
    }

    const token = jwt.sign({ id: user.id }, secretKey);
    res.status(200).json({
      type: "Login Successful",
      messasge: "Successfully logged in user",
      token: token,
      user
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      type: "Server Error",
      message: "Internal server error",
    });
  }
};

const validate = async (req, res) => {
  try {
    const {userId} = req;

    const user = await User.findOne({ where: { id: userId } });

    if(user) {
      return res.status(200).json({
        type: "User Authorized",
        message: "User is authorized!",
        user
      })
    }

  }catch(err) {
    console.log(err)
  }
}

const validateMember = async (req, res) => {
  try {
    const {userId} = req;

    const user = await Member.findOne({ where: { id: userId } });

    if(user) {
      return res.status(200).json({
        type: "Member Authorized",
        message: "Member is authorized!",
        member: user
      })
    }

  }catch(err) {
    console.log(err)
  }
}

module.exports = {
  registerUser,
  loginUser,
  validate,
  registerMember,
  loginMember,
  validateMember
};
