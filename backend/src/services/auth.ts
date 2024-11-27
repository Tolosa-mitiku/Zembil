import { User } from "../models/users"; // Mongoose model for User

// Service to create a new user in MongoDB
export const createUserInDB = async (firebaseUID: string, role: string) => {
  try {
    // Create a new user document in MongoDB
    const user = new User({
      firebaseUID,
      role,
    });
    console.log(user);
    // Save the user document to the database
    await user.save();

    return user;
  } catch (error) {
    console.log(error);
    throw new Error("Error creating user in MongoDB");
  }
};

// Service to find a user by Firebase UID
export const findUserByFirebaseUID = async (firebaseUID: string) => {
  try {
    // Query the database for a user with the given Firebase UID
    const user = await User.findOne({ firebaseUID });

    return user;
  } catch (error) {
    throw new Error("Error finding user by Firebase UID");
  }
};
