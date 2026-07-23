
import { userservice, GetUserById, followandUnfollow, UpdateUserProfile, GetAllUsers, loginUserData } from "../services/user.service.js";
import { createNotificationService } from "../services/music.service.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userLoginService } from "../services/user.service.js";
import cloudinary from "cloudinary";
import getdataUri from "../Utils/URlGenerator.js";
export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userservice(name, email, hashedPassword);

    const token = jwt.sign({ userId: user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });
    console.log("✅ User inserted");
    res.status(201).json({ message: "User added successfully", userId: user || "ddsds", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;


    const user = await userLoginService(email);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }



    const isPasswordValid = await bcrypt.compare(password, user.Password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user.ID }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });
    console.log("✅ User logged in");
    res.status(200).json({ message: "User logged in successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
export const GetUserController = async (req, res) => {
  const user = req.user
  res.status(201).json({ message: user })
}
export const GetUserByIdController = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await GetUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: user });
  }
  catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);

  }
}
export const followandUnfollowController = async (req, res) => {
  const {Followinguser} = req.body
  const loggedinUSer = req.user.userId
      await createNotificationService({
        senderId: Followinguser,
        receiverId: loggedinUSer,
        type: "follow",
    });
  const result = await followandUnfollow(Followinguser, loggedinUSer);
  res.status(200).json({ message: "Follow/Unfollow action completed", result });
}
export const GetUserallController = async (req, res) => {
  const users = await GetAllUsers()
  res.status(200).json({ message: users })
}

export const UpdateuserprofileController = async (req, res) => {
  try {
    const { Name } = req.body;
    const UserPic = req.file;
    const userId = req.user.userId;

    let imageUrl = null;

    if (UserPic) {
      const uploadedUserPic = getdataUri(UserPic);

      const cloudinaryResponse = await cloudinary.v2.uploader.upload(
        uploadedUserPic.content,
        {
          resource_type: "image",
          folder: "music_app/profile_pictures"
        }
      );

      imageUrl = cloudinaryResponse.secure_url;
    }

    const result = await UpdateUserProfile(userId, Name, imageUrl);

    res.status(200).json({
      message: "Profile updated successfully",
      result
    });

  } catch (err) {
    res.status(500).json({
      message: err.message || "Failed to update profile"
    });
  }
};
export const LoginUserDataController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userData = await loginUserData(userId);
    res.status(200).json({ message: userData });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to retrieve user data" });
  }
}
export const LogoutUserController = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "lax" });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to log out user" });
  }
};