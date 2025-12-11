const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    // Auth Info
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { 
        type: String, required: true, unique: true, lowercase: true, trim: true 
    },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['HR', 'Admin', 'Employee', 'Manager'], 
        default: 'Employee' 
    },
    isActive: { type: Boolean, default: true },

    // Professional Info
    department: { type: String, default: 'Unassigned' }, // Can be linked to Department model if needed
    position: { type: String, default: 'Unassigned' },
    salary: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    phone: String,
    address: String,

    // Leave Balance
    leaveBalance: {
        annual: { type: Number, default: 15 },
        sick: { type: Number, default: 10 },
        personal: { type: Number, default: 5 },
        unpaid: { type: Number, default: 0 }
    }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);