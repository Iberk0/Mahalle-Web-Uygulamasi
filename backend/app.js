const express = require('express');
const app = express();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const { stringify } = require('querystring');
const { Certificate } = require('crypto');

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

app.get('/api/users/:id/apartment', (req, res) => {
    const { id } = req.params;
    const query = `SELECT daire_no, site_no FROM apartments WHERE resident_id = ?`;
    db.get(query, [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Bilgiler getirilemedi' });
        } else if (row) {
            res.json({ daire_no: row.daire_no, site_no: row.site_no });
        } else {
            res.status(404).json({ error: 'Kayıt bulunamadı' });
        }
    });
});


// Mesaj Gönderme (Send Message)
app.post('/api/messages', (req, res) => {
    const { userID, username, message } = req.body;
    const query = `INSERT INTO messages (userID, username, message, messagetime) VALUES (?, ?, ?, datetime('now','localtime'))`;

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
//residentları listeleyen endpoint
app.get('/api/users/managersite', (req, res) => {
    // Manager rolüne sahip kullanıcının site_no'sunu alıyoruz
    const getManagerSiteQuery = `
        SELECT apartments.site_no 
        FROM users
        JOIN apartments ON users.id = apartments.resident_id
        WHERE users.role = 'manager'
    `;
    
    db.get(getManagerSiteQuery, (err, managerRow) => {
        if (err) {
            return res.status(500).json({ error: 'Manager site_no getirilemedi' });
        }
        
        if (managerRow) {
            const managerSiteNo = managerRow.site_no;
            
            // Manager'in site_no'su ile aynı site_no'ya sahip kullanıcıları getiriyoruz
            const getUsersQuery = `
                SELECT users.name, users.surname, users.email, apartments.daire_no
                FROM users
                JOIN apartments ON users.id = apartments.resident_id
                WHERE apartments.site_no = ?
            `;
            
            db.all(getUsersQuery, [managerSiteNo], (err, rows) => {
                if (err) {
                    return res.status(500).json({ error: 'Kullanıcı bilgileri getirilemedi' });
                }
                
                res.json(rows);
            });
        } else {
            res.status(404).json({ error: 'Manager site_no bulunamadı' });
        }
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
        await db.run('INSERT INTO apartments (daire_no, resident_id) VALUES (?, ?)', [apartmentNo, resident_id]);
        res.json({ message: 'Apartment assigned successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to assign apartment' });
    }
});

//endpoint to delete an user but a manager
app.delete('/api/users/:firstName/:lastName', async (req, res) => {
    const { firstName, lastName } = req.params;

    const checkIfManager = await new Promise((resolve, reject) => {
        db.get(
            'SELECT role FROM users WHERE name = ? AND surname = ?',
            [firstName, lastName],
            (err, row) => {
                if (err) reject(err);
                resolve(row); // Kullanıcıyı bulursa döner, aksi halde `undefined`
            }
        );
    });

    if(checkIfManager.role === 'manager'){
        return res.status(500).json({ error: 'You cannot delete a manager account' });
    }
    else{
        const query = `DELETE FROM users WHERE name = ? AND surname = ?`;

        db.run(query, [firstName, lastName], function(err) {
            if (err) {
                return res.status(500).json({ error: 'Kullanıcı silinemedi' });
            } else if (this.changes > 0) {
                res.json({ message: 'Kullanıcı başarıyla silindi' });
            } else {
                res.status(404).json({ error: 'Kullanıcı bulunamadı' });
            }
        });
    }



});
//add service
app.post('/api/addService', (req, res) => {
    console.log('Add Service Request Body:', req.body);
    const { firstName, lastName, telephoneNumber, serviceType } = req.body;

    // Gerekli tüm alanların sağlandığından emin olun
    if (!firstName || !lastName || !telephoneNumber || !serviceType) {
        return res.status(400).json({ error: 'Tüm alanlar zorunludur' });
    }
    
    const query = `INSERT INTO services (first_name, last_name, telephone_number, service_type) VALUES (?, ?, ?, ?)`;
    db.run(query, [firstName, lastName, telephoneNumber, serviceType], function (err) {
        if (err) {
            console.error('Hata:', err);
            return res.status(500).json({ error: 'Servis eklenirken bir hata oluştu' });
        } else {
            res.status(201).json({ message: 'Servis başarıyla eklendi', serviceId: this.lastID });
        }
    });
});

// Servis elemanlarını getirmek için endpoint

app.get('/api/services', (req, res) => {
    const getAllServicesQuery = `
        SELECT serviceid, first_name, last_name, telephone_number, service_type
        FROM services
    `;
    
    db.all(getAllServicesQuery, (err, rows) => {
        if (err) {
            console.error('Error fetching services:', err);
            return res.status(500).json({ error: 'Servis bilgileri getirilemedi' });
        }
        
        res.json(rows); // Tüm servis kayıtları döndürülüyor
    });
});

// Event oluşturma endpoint'i
app.post('/api/events', (req, res) => {
    const { event_name, event_description } = req.body;

    if (!event_name || !event_description) {
        return res.status(400).json({ error: 'Event name and description are required' });
    }

    const insertEventQuery = `INSERT INTO event (event_name, event_description) VALUES (?, ?)`;

    db.run(insertEventQuery, [event_name, event_description], function (err) {
        if (err) {
            console.error('Error inserting event:', err);
            return res.status(500).json({ error: 'Failed to create event' });
        }

        res.status(201).json({ 
            message: 'Event created successfully', 
            event_id: this.lastID 
        });
    });
});
// Eventleri listeleme endpoint'i
app.get('/api/events', (req, res) => {
    const getEventsQuery = `SELECT * FROM event`;

    db.all(getEventsQuery, [], (err, rows) => {
        if (err) {
            console.error('Error fetching events:', err);
            return res.status(500).json({ error: 'Failed to retrieve events' });
        }

        res.status(200).json(rows);
    });
});

//Complain ekleme
app.post('/api/complaint', (req, res) => {
    const { postType, messageInput, userId } = req.body; // POST verilerini al

    let complainer_name = null;
    let complainer_surname = null;
    let complainer_email = null;

    // Eğer "named" seçildiyse, login olan kullanıcının bilgilerini kullan
    if (postType === 'name' && userId) {
        db.get('SELECT name, surname, email FROM users WHERE id = ?', [userId], (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error retrieving user data.' });
            }
            if (row) {
                complainer_name = row.name;
                complainer_surname = row.surname;
                complainer_email = row.email;
            }
            
            // Veriyi complain tablosuna ekle
            db.run(
                'INSERT INTO complain (complainer_name, complainer_surname, complainer_email, complain) VALUES (?, ?, ?, ?)',
                [complainer_name, complainer_surname, complainer_email, messageInput],
                function (err) {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: 'Error inserting complain.' });
                    }
                    res.status(201).json({ message: 'Complaint submitted successfully.' });
                }
            );
        });
    } else {
        // Eğer "anonymous" seçildiyse, bilgileri null olarak kaydet
        db.run(
            'INSERT INTO complain (complainer_name, complainer_surname, complainer_email, complain) VALUES (?, ?, ?, ?)',
            [complainer_name, complainer_surname, complainer_email, messageInput],
            function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Error inserting complain.' });
                }
                res.status(201).json({ message: 'Complaint submitted successfully.' });
            }
        );
    }
});

//Complainleri listele
app.get('/api/complaints', (req, res) => {
    // Complaints tablosundaki tüm verileri getiriyoruz
    const getComplaintsQuery = `
        SELECT complain.complainer_name, complain.complainer_surname, complain.complainer_email, complain.complain
        FROM complain
    `;
    
    db.all(getComplaintsQuery, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Şikayetler getirilemedi' });
        }
        
        res.json(rows); // Şikayetlerin tüm bilgilerini döndür
    });
});


// Sunucuyu Başlatma
const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});
