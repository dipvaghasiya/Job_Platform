import app from './app.js'
import cloudinary from 'cloudinary'
import connectDb from './Database/dbConnection.js'

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


connectDb().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port number ${process.env.PORT}`);
    })
}).catch((err) => {
    console.log("MongoDB connection error: ", err);
})
