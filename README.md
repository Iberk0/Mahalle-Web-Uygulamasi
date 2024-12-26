# Mahalle Apartman Yönetim Sistemi

Bu proje, apartman yöneticilerinin ve sakinlerinin apartman işlerini daha verimli bir şekilde yönetmelerine yardımcı olmayı amaçlayan bir web uygulamasıdır. Aidat takibi, duyurular, toplantı yönetimi, gider takibi gibi özellikleri içerir.

## Özellikler

*   **Aidat Takibi:** Aidat ödemelerini kaydedin ve takip edin.
*   **Duyurular:** Apartman sakinlerine önemli duyurular yayınlayın.
*   **Toplantı Yönetimi:** Toplantıları planlayın ve duyurun.
*   **Gider Takibi:** Apartman giderlerini kaydedin ve yönetin.
*   **Kullanıcı Yönetimi:** Farklı rollerde (yönetici, sakin) kullanıcılar oluşturun ve yönetin.

## Teknolojiler

*   **Arka Uç (Backend):** Node.js, Express.js, SQLite
*   **Ön Uç (Frontend):** HTML, CSS, JavaScript (Kullanılan kütüphaneler belirtilmemiş, eklenebilir)
*   **Veritabanı:** SQLite

## Kurulum

Proje iki ana bölümden oluşmaktadır: arka uç (backend) ve ön uç (frontend).

### Ön Gereksinimler

*   Node.js ve npm (Node Package Manager)
*   Python 3 (Ön uç için basit bir sunucu kullanılıyorsa) veya `http-server`
*   `sqlite3` (Veritabanı için)

### Arka Uç Kurulumu

1.  Proje dizinine gidin:

    ```bash
    cd backend
    ```

2.  Gerekli Node.js modüllerini yükleyin:

    ```bash
    npm install
    ```
    (Ya da sağladığınız kurulum betiğini kullanabilirsiniz. Aşağıda daha detaylı bir versiyonu var)

3.  Arka uç sunucusunu başlatın:

    ```bash
    node app.js
    ```

### Ön Uç Kurulumu

İki farklı yöntemle ön ucu başlatabilirsiniz.

**Yöntem 1 (Python ile):**

1.  Proje dizinine gidin:

    ```bash
    cd frontend
    ```

2.  Basit bir Python sunucusu başlatın (örneğin 8000 portunda):

    ```bash
    python3 -m http.server 8000
    ```

**Yöntem 2 (`http-server` ile):**

1.  `http-server`'ı global olarak yükleyin (eğer yüklü değilse):

    ```bash
    npm install -g http-server
    ```

2.  Proje dizinine gidin:

    ```bash
    cd frontend
    ```

3.  Ön uç sunucusunu başlatın (örneğin 8000 portunda):

    ```bash
    http-server -p 8000
    ```

### Veritabanı Kontrolü

Veritabanını kontrol etmek için:

```bash
cd backend/db
sqlite3 database.db



#!/bin/bash

# Paket listesini güncelle ve ön gereksinimleri yükle
sudo apt update
sudo apt install -y curl

# Node.js ve npm'yi yükle (NodeSource kullanarak en son LTS sürümü için)
curl -fsSL [https://deb.nodesource.com/setup_18.x](https://deb.nodesource.com/setup_18.x) | sudo -E bash -
sudo apt install -y nodejs

# Node.js ve npm kurulumunu doğrula
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# package.json yoksa yeni bir npm projesi başlat
if [ ! -f "package.json" ]; then
  npm init -y
fi

# Gerekli Node.js kütüphanelerini yükle
npm install express path sqlite3 body-parser cors express-session

echo "Tüm gerekli kütüphaneler yüklendi."

# Kurulumu onayla
echo "Yüklü kütüphaneler:"
npm list express path sqlite3 body-parser cors express-session --depth=0

echo "Kurulum tamamlandı."
