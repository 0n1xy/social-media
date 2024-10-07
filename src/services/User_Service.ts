import User from "@/models/UserModel";
import { IUser } from "@/types/User_Interface";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

class UserService {
  public async encryptPasswords(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  public async signUpMethod(user: IUser) {
    try {
      // Check if the email or username already exists in the database
      const findEmail = await User.findOne({ email: user.email });
      const findUser = await User.findOne({ username: user.username });

      // If neither the email nor the username exists, create the new user
      if (!findEmail && !findUser) {
        // Encrypt the user's password
        const encryptedPassword = await this.encryptPasswords(user.password);

        // Generate a new ObjectId for the user
        const userId = new mongoose.Types.ObjectId();

        // Create a new user without spreading _id (to avoid duplication)
        const { _id, ...userDataWithoutId } = user;

        // Create and save the new user in the database
        const saveUser = await User.create({
          _id: userId,
          ...userDataWithoutId,
          password: encryptedPassword,
        });

        return saveUser;
      } else {
        // Throw a custom error if the email or username already exists
        if (findEmail) {
          throw new Error(
            "Email already exists. Please use a different email."
          );
        }
        if (findUser) {
          throw new Error(
            "Username already exists. Please use a different username."
          );
        }
      }
    } catch (err) {
      console.error("Error in signUpMethod:", err);
      throw new Error("User registration failed.");
    }
  }

  public async loginMethod(user: IUser) {
    try {
    } catch (error: any) {}
  }
}

export default UserService;
