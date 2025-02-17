import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePhoto: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhlulfiQE8eiDJLBM2sPI80kv2YxlldcssWg&s'
    }
}, { timestamps: true })


const User = mongoose.model('User', userSchema);

export default User;