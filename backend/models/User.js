const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: { 
        type: String, 
        required: true,
        trim: true
    },
    lastName: { 
        type: String, 
        required: true,
        trim: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true
    },
    password: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String,
        trim: true
    },
    address: { 
        type: String,
        trim: true
    },
    emergencyContact: { 
        type: String,
        trim: true
    },
    emergencyPhone: { 
        type: String,
        trim: true
    },
    role: { 
        type: String, 
        enum: ['employee', 'manager', 'admin'], 
        default: 'employee' 
    },
    profilePicture: {
        type: String,
        default: '/assets/default-avatar.png'
    },
    department: {
        type: String,
        trim: true
    },
    position: {
        type: String,
        trim: true
    },
    dateHired: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    leaveBalance: {
        annual: {
            type: Number,
            default: 15
        },
        sick: {
            type: Number,
            default: 10
        },
        personal: {
            type: Number,
            default: 5
        },
        bereavement: {
            type: Number,
            default: 3
        },
        unpaid: {
            type: Number,
            default: 0 // Unlimited, but we'll track it
        }
    }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
