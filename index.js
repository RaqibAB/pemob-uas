const express = require('express');
const cors = require('cors');
const app = express();

// PENTING: Railway akan menyuntikkan PORT secara otomatis
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Agar bisa diakses dari HP/Web lain
app.use(express.json());

// 1. Route Cek Server (Health Check)
app.get('/', (req, res) => {
  res.json({ 
    status: "Active", 
    message: "Server Backend Live di Railway! 🚀" 
  });
});

// 2. Route Dummy Login (Untuk testing Flutter)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simulasi logic login
  if(email === "test@admin.com" && password === "123") {
    res.json({
      success: true,
      message: "Login Berhasil!",
      user: { id: 1, name: "Admin Ganteng" }
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Email atau Password Salah"
    });
  }
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});