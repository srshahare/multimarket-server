const bcrypt = require("bcrypt");
const path = require("path");
const db = require("../models");
const { Op } = require("sequelize");
const User = db.user;
const Agent = db.agent;

const domain = process.env.DOMAIN

const updatePassword = async (req, res, next) => {
  try {
    const { userId } = req;
    const { newPass, oldPass } = req.body;

    const user = await User.findOne({ $where: { id: userId } });

    if (!user) {
      return res.status(500).json({
        type: "No User Found",
        message: "No user exist with provided token",
      });
    }

     // Check password
     const result = await bcrypt.compare(oldPass, user.passwordHash);
     if(!result) {
      return res.status(400).json({
        type: "Wrong Password",
        message: "Your old password is wrong"
      })
     }

    const passHash = await bcrypt.hash(newPass, 10);
    await user.update({
      passwordHash: passHash,
    });

    res.status(200).json({
      type: "User Updated",
      message: "User successfully updated",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      type: "Server Error",
      message: "Internal server error",
    });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { userId } = req;
    const { password } = req.body;

    const user = await User.findOne({ $where: { id: userId } });

    if (!user) {
      return res.status(500).json({
        type: "No User Found",
        message: "No user exist with provided token",
      });
    }

    const passHash = await bcrypt.hash(password, 10);
    await user.update({
      passwordHash: passHash,
    });

    res.status(200).json({
      type: "User Updated",
      message: "User successfully updated",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      type: "Server Error",
      message: "Internal server error",
    });
  }
};

const listDownlines = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(409).json({
        type: "Not Found",
        message: "User not found",
      });
    }
    const { domainHeader } = user;

    const downlines = await User.findAll({
      where: {
        refDomain: `${domainHeader}-agent.${domain}`,
      },
    });

    let userIds = [];
    downlines.forEach((item) => {
      userIds.push(item.id);
    });

    const agentSites = await Agent.findAll({
      where: {
        userId: { [Op.in]: userIds },
      },
    });

    res.status(200).json({
      type: "List Fetched",
      message: "Downlines for the user fetched",
      data: agentSites,
    });
  } catch (err) {
    console.log(err);
  }
};

const updateLogo = async (req, res) => {
  try {
    const file = req.file;
    const { userId } = req;
    if (!file) {
      return res.status(400).send("No image file was uploaded");
    }
    // const imageUrl = path.join("/uploads", file.filename);
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;


    const updateAgent = await Agent.findOne({
      where: {
        userId: userId,
      },
    });

    await updateAgent.update({
      logo: imageUrl,
    });

    return res.status(200).json({ data: updateAgent });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  updatePassword,
  listDownlines,
  updateLogo,
};
