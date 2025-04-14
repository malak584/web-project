router.post("/signup", async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "User already exists" });
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Save new user
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
  
      // Generate token
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  