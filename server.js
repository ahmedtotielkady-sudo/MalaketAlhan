const express = require("express");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3000;

app.use(express.json());

const users = [];

app.get("/", (req, res) => {
  res.json({
    app: "مملكة الألحان",
    status: "online",
    version: "1.0.0"
  });
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "اسم المستخدم وكلمة المرور مطلوبان"
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
    });
  }

  if (users.some(user => user.username === username)) {
    return res.status(409).json({
      message: "اسم المستخدم موجود بالفعل"
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    id: users.length + 1,
    username,
    passwordHash,
    coins: 0
  };

  users.push(user);

  res.status(201).json({
    message: "تم إنشاء الحساب بنجاح",
    user: {
      id: user.id,
      username: user.username,
      coins: user.coins
    }
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(401).json({
      message: "اسم المستخدم أو كلمة المرور غير صحيحة"
    });
  }

  const validPassword = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!validPassword) {
    return res.status(401).json({
      message: "اسم المستخدم أو كلمة المرور غير صحيحة"
    });
  }

  res.json({
    message: "تم تسجيل الدخول بنجاح",
    user: {
      id: user.id,
      username: user.username,
      coins: user.coins
    }
  });
});

app.listen(PORT, () => {
  console.log("مملكة الألحان تعمل على Port 3000");
});
