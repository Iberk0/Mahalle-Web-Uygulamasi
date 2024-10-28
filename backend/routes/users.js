const express = require('express');
const router = express.Router();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Veritabanı bağlantısı
const db = new sqlite3.Database(path.join(__dirname, '../db', 'database.db'));

// Tüm kullanıcıları getiren bir örnek GET isteği
router.get('/', (req, res) => {
    const query = 'SELECT * FROM users';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json({ data: rows });
        }
    });
});

// Yeni bir kullanıcı ekleyen POST isteği
router.post('/', (req, res) => {
    const { name, email } = req.body;
    const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
    db.run(query, [name, email], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Kullanıcı başarıyla eklendi', id: this.lastID });
        }
    });
});

module.exports = router;
