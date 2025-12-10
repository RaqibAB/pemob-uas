const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// KONEKSI DATABASE (Mengambil Password otomatis dari Railway)
const pool = mysql.createPool({
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '',
    database: process.env.MYSQLDATABASE || 'railway',
    port: process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Route Cek Server
app.get('/', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        connection.release();
        res.json({ status: "Active", db: "Connected 🟢" });
    } catch (err) {
        res.json({ status: "Active", db: "Error 🔴", error: err.message });
    }
});

// Route LOGIN (Pakai Database Asli)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Cari user berdasarkan email
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: "Email tidak ditemukan" });
        }

        const user = rows[0];
        // Cek password (sederhana)
        if (password === user.password) {
            res.json({
                success: true,
                message: "Login Berhasil",
                data: { id: user.id, name: user.name, email: user.email }
            });
        } else {
            res.status(401).json({ success: false, message: "Password Salah" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error: " + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});