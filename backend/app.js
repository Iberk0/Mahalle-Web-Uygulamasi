const express = require('express');
const app = express();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors'); // CORS modülünü ekleyin

// CORS ayarlarını yapılandırın
app.use(cors());

// Veritabanı bağlantısı
const db = new sqlite3.Database(path.join(__dirname, 'db', 'database.db'), (err) => {
    if (err) {
        console.error('Veritabanına bağlanılamadı:', err.message);
    } else {
        console.log('SQLite veritabanına başarıyla bağlandı.');
    }
});

// Middleware
app.use(bodyParser.json());

// Kullanıcı Kaydı (Sign Up)
app.post('/api/users/signup', (req, res) => {
    console.log('Signup Request Body:', req.body); // Gelen veriyi terminale yazdır
    const { email, name, surname, password } = req.body;
    const query = `INSERT INTO users (email, name, surname, password) VALUES (?, ?, ?, ?)`;
    db.run(query, [email, name, surname, password], function (err) {
        if (err) {
            res.status(500).json({ error: 'Kullanıcı kaydı başarısız' });
        } else {
            res.status(201).json({ message: 'Kayıt başarılı', userId: this.lastID });
        }
    });
});

// Kullanıcı Girişi (Login)
app.post('/api/users/login', (req, res) => {
    console.log('Login Request Body:', req.body); // Gelen veriyi terminale yazdır
    const { email, password } = req.body;
    const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
    db.get(query, [email, password], (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Giriş hatası' });
        } else if (row) {
            res.json({ message: 'Giriş başarılı', user: row });
        } else {
            res.status(401).json({ error: 'Geçersiz e-posta veya şifre' });
        }
    });
});

// Kullanıcının apartman numarasını getiren endpoint
// Kullanıcının apartman numarasını getiren endpoint
app.get('/api/users/:resident_id/apartment', (req, res) => {
    const { resident_id } = req.params; // resident_id'yi al
    const query = `SELECT apartment_number FROM apartments WHERE resident_id = ?`; // resident_id ile sorgula
    db.get(query, [resident_id], (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Apartman numarası getirilemedi' });
        } else if (row) {
            res.json({ apartment_number: row.apartment_number }); // apartment_number döndür
        } else {
            res.status(404).json({ error: 'Apartman numarası bulunamadı' });
        }
    });
});


// Sunucuyu Başlatma
const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});
