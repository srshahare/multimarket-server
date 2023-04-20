const bcrypt = require("bcrypt");
const path = require("path");
const db = require("../models");
const { Op } = require("sequelize");
const Member = db.member;

const updatePassword = async (req, res, next) => {
  try {
    const { userId } = req;
    const { newPass, oldPass } = req.body;

    const user = await Member.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(500).json({
        type: "No Member Found",
        message: "No member exist with provided credentials",
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

const getMember = async (req, res) => {
  try {
    const {userId} = req;
    const member = await Member.findOne({
      where: {
        id: userId
      }
    })

    if(member) {
      return res.status(200).json({
        type: "Member Profile",
        message: "Member profile fetched successfully!",
        data: member
      })
    }
  }catch(err) {
    console.log(err)
  }
}

const updateLogo = async (req, res) => {
  try {
    const file = req.file;
    const { userId } = req;
    if (!file) {
      return res.status(400).send("No image file was uploaded");
    }
    // const imageUrl = path.join("/uploads", file.filename);
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;


    const updateMember = await Member.findOne({
      where: {
        id: userId,
      },
    });

    await updateMember.update({
      logo: imageUrl,
    });

    return res.status(200).json({ data: updateMember });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  updatePassword,
  getMember,
  updateLogo
};
