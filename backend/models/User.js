const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

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
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: { 
        type: String, 
        required: true,
        minlength: [6, 'Password must be at least 6 characters long']
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
        enum: ['HR', 'Interviewer', 'Admin'], 
        default: 'HR' 
    },
    profilePicture: {
        type: String,
        default: '/assets/default-avatar.png'
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true
    },
    position: {
        type: String,
        required: [true, 'Position is required'],
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
    },
    lastLogin: {
        type: Date
    }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
