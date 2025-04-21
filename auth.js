import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sequelize from '../config/db.js';
import defineUser from '../models/user.js';

const User = defineUser(sequelize);


// تسجيل مستخدم جديد
export const register = async (req, res) => {
  try {
    const { email, password, username, user_type } = req.body;
    console.log('📝 Register Request Body:', req.body);

    // التحقق من اكتمال البيانات
    if (!email || !password || !username || !user_type) {
      return res.status(400).json({ 
        error: "All fields are required (email, password, username, user_type)" 
      });
    }

    // التحقق من نوع المستخدم
    if (!['Business', 'Individual'].includes(user_type)) {
      return res.status(400).json({ 
        error: "user_type must be either 'Business' or 'Individual'" 
      });
    }

    // التحقق من وجود الإيميل مسبقًا
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email is already registered" });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء المستخدم
    const user = await User.create({ 
      email, 
      password: hashedPassword, 
      username,
      user_type,
      role: 'user'
    });

    console.log('✅ User registered:', {
      id: user.id,
      email: user.email,
      username: user.username
    });

    res.status(201).json({ 
      message: "User created successfully!", 
      userId: user.id 
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ error: error.message });
  }
};

// تسجيل الدخول
export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
  
      res.json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ error: 'Signin failed' });
    }
  };
  
