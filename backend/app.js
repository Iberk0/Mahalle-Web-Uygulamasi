const express = require('express');
const app = express();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors'); // CORS modülünü ekleyin
const session = require('express-session'); // express-session modülünü ekleyin

// CORS ayarlarını yapılandırın
app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware'ini yapılandır
app.use(session({
    secret: 'your-secret-key', // Güvenlik için bir gizli anahtar kullanın
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // HTTPS kullanmıyorsanız 'secure: false' yapın
}));

// Veritabanı bağlantısı
const db = new sqlite3.Database(path.join(__dirname, 'db', 'database.db'), (err) => {
    if (err) {
        console.error('Veritabanına bağlanılamadı:', err.message);
    } else {
        console.log('SQLite veritabanına başarıyla bağlandı.');
    }
});

// Kullanıcı Kaydı (Sign Up)
app.post('/api/users/signup', (req, res) => {
    console.log('Signup Request Body:', req.body);
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
    console.log('Login Request Body:', req.body);
    const { email, password } = req.body;
    const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
    db.get(query, [email, password], (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Giriş hatası' });
        } else if (row) {
            // Oturum ayarlama
            req.session.userId = row.id; // Kullanıcı kimliğini oturumda saklayın
            res.json({ message: 'Giriş başarılı', user: row });
        } else {
            res.status(401).json({ error: 'Geçersiz e-posta veya şifre' });
        }
    });
});

// Oturum kontrolü için endpoint
app.get('/api/session', (req, res) => {
    if (req.session.userId) {
        res.json({ userId: req.session.userId });
    } else {
        res.status(401).json({ error: 'Oturum yok' });
    }
});

// Kullanıcının apartman numarasını getiren endpoint
app.get('/api/users/:id/apartment', (req, res) => {
    const { id } = req.params;
    const query = `SELECT apartment_number FROM apartments WHERE resident_id = ?`;
    db.get(query, [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Apartman numarası getirilemedi' });
        } else if (row) {
            res.json({ apartment_number: row.apartment_number });
        } else {
            res.status(404).json({ error: 'Apartman numarası bulunamadı' });
        }
    });
});

// Mesaj Gönderme (Post Message)
app.post('/api/messages', (req, res) => {
    
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

// Sunucuyu Başlatma
const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});
