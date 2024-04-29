import express from "express";
import { sendEmail } from "./sendMail.js";
import "dotenv/config";
import uploadImage from "./Image-upload.js";
import path from "path";
import dbConnect from "./connection.js";
import UserModel from "./userModel.js";
import cloudinary from "./cloudinary.js";

const app = express();
const port = process.env.PORT || 7000;
app.use(express.json());
app.use(express.static(path.resolve() + "/public"));


// Connect to MongoDB
dbConnect();


app.post('/send', uploadImage('./public'), async (req, res) => {
    const { name, phone, email } = req.body;

    try {
        if (!email) {
            throw new Error('Email is required');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }

        const uploadBlogToCloudinary = async (file) => {
            if (file) {
                const uploadedBlogContent = await cloudinary.uploader.upload(file, {
                    folder: "mail",
                    resource_type: "image",
                });
                return uploadedBlogContent.url || "";
            }
            return "";
        };

        const uploadedImageUrl = await uploadBlogToCloudinary(
            req.files.image[0].path
        );

        // Send email
        sendEmail(email, req.files);

        // Create new user
        const user = new UserModel({
            name,
            email,
            phone,
            image: uploadedImageUrl,
        });
        await user.save(); 

        res.send('success');
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: false, message: error.message });
    }
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });