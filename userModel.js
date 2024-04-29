import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User Name is required"],
  },
  phone: {
    type: String,
    requird: [true, "user Phone No is required"],
  },
  email: {
    type: String,
    required: true,
  },

  image: {
    type: Object,
  },
});

const UserModel = mongoose.model("userSchema", userSchema);

export default UserModel;
