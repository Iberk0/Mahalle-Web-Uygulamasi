const express = require('express');
const app = express();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const { stringify } = require('querystring');

// CORS ayarları
app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware'i yapılandır
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
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
            req.session.userId = row.id;
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

// Mesaj Gönderme (Send Message)
app.post('/api/messages', (req, res) => {
    const { userID, username, message } = req.body;
    const query = `INSERT INTO messages (userID, username, message, messagetime) VALUES (?, ?, ?, datetime('now'))`;

    db.run(query, [userID, username, message], function (err) {
        if (err) {
            res.status(500).json({ error: 'Mesaj kaydı başarısız' });
        } else {
            res.json({ message: 'Mesaj başarıyla gönderildi', messageID: this.lastID });
        }
    });
});

// Mesajları döndüren GET endpoint
app.get('/api/messages', (req, res) => {
    const query = 'SELECT * FROM messages ORDER BY messagetime DESC'; // Mesajları zaman damgasına göre sıralar

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});


// Endpoint to get userID based on first name and last name
app.post('/api/getUserID', async (req, res) => {
    const { firstName, lastName } = req.body;
    const query = `SELECT id FROM users WHERE name = ? AND surname = ?`;
    
    db.get(query, [firstName, lastName], (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Kullanıcı kimliği getirilemedi' });
        } else if (row) {
            res.json({ id: row.id });

        } else {
            res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        }
    });
});



// Endpoint to assign apartment with resident_id as userID
app.post('/api/assignApartment', async (req, res) => {
    const { resident_id, apartmentNo } = req.body;
    try {
        await db.run('INSERT INTO apartments (apartment_number, resident_id) VALUES (?, ?)', [apartmentNo, resident_id]);
        res.json({ message: 'Apartment assigned successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to assign apartment' });
    }
});

// Mesaj silme (Delete Message)
app.delete('/api/messages/:messageID', (req, res) => {
    const messageID = req.params.messageID; // messageID'yi req.params ile alıyoruz
    const query = `DELETE FROM messages WHERE messageID = ?`;

    db.run(query, [messageID], function (err) {
        if (err) {
            res.status(500).json({ error: 'Mesaj silinemedi' });
        } else if (this.changes > 0) {
            res.json({ message: 'Mesaj silindi' });
        } else {
            res.status(404).json({ error: 'Mesaj bulunamadı' });
        }
    });
});

// Sunucuyu Başlatma
const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});
