const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const createTestUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Check if test users already exist
    const existingEmployee = await User.findOne({ email: 'employee@test.com' });
    const existingManager = await User.findOne({ email: 'manager@test.com' });

    if (!existingEmployee) {
      // Create test employee
      const passwordHash = await bcrypt.hash('password123', 10);
      const employee = new User({
        firstName: 'Test',
        lastName: 'Employee',
        email: 'employee@test.com',
        password: passwordHash,
        role: 'employee',
        department: 'Engineering',
        position: 'Software Developer',
        dateHired: new Date('2023-01-15'),
        leaveBalance: {
          annual: 15,
          sick: 10,
          personal: 5,
          bereavement: 3,
          unpaid: 0
        }
      });

      await employee.save();
      console.log('Test employee created successfully:', employee._id.toString());
    } else {
      console.log('Test employee already exists:', existingEmployee._id.toString());
      // Update the existing employee with leave balance if needed
      if (!existingEmployee.leaveBalance || !existingEmployee.leaveBalance.annual) {
        await User.findByIdAndUpdate(existingEmployee._id, {
          leaveBalance: {
            annual: 15,
            sick: 10,
            personal: 5,
            bereavement: 3,
            unpaid: 0
          }
        });
        console.log('Updated existing employee with leave balance');
      }
    }

    if (!existingManager) {
      // Create test manager
      const passwordHash = await bcrypt.hash('password123', 10);
      const manager = new User({
        firstName: 'Test',
        lastName: 'Manager',
        email: 'manager@test.com',
        password: passwordHash,
        role: 'manager',
        department: 'Engineering',
        position: 'Engineering Manager',
        dateHired: new Date('2020-05-10'),
        leaveBalance: {
          annual: 20,
          sick: 15,
          personal: 7,
          bereavement: 5,
          unpaid: 0
        }
      });

      await manager.save();
      console.log('Test manager created successfully:', manager._id.toString());
    } else {
      console.log('Test manager already exists:', existingManager._id.toString());
      // Update the existing manager with leave balance if needed
      if (!existingManager.leaveBalance || !existingManager.leaveBalance.annual) {
        await User.findByIdAndUpdate(existingManager._id, {
          leaveBalance: {
            annual: 20,
            sick: 15,
            personal: 7,
            bereavement: 5,
            unpaid: 0
          }
        });
        console.log('Updated existing manager with leave balance');
      }
    }

    console.log('Test users are ready to use');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test users:', error);
    process.exit(1);
  }
};

// Run the function
createTestUsers(); 