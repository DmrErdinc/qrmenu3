# Namecheap cPanel – Node.js Deploy Rehberi

## Gereksinimler
- Namecheap **EasyWP** değil, **cPanel** hosting (Shared / VPS)
- cPanel'de **Setup Node.js App** eklentisi aktif olmalı (EasyWP'de yoktur)
- SSH erişimi (önerilir) veya cPanel File Manager

---

## ADIM 1 – Projeyi Hazırla (Yerel Bilgisayar)

### 1.1 .env Dosyası Oluştur
`.env.example` dosyasını kopyalayıp `.env` olarak kaydet:
```
NODE_ENV=production
PORT=3000
SESSION_SECRET=buraya-en-az-32-karakterlik-rastgele-sifre-yaz
```
> **Önemli:** `.env` dosyasını asla git'e ekleme, `.gitignore`'da zaten var.

### 1.2 Yüklenecek Dosyaları Kontrol Et
Sunucuya şu dosya/klasörler gidecek — `node_modules/` **GİTMEZ**:
```
qrmenu/
├── server.js
├── package.json
├── .env                  ← oluşturduğun env dosyası
├── data/
│   ├── menu.json
│   └── settings.json
└── public/
    ├── admin.html
    ├── admin-dashboard.html
    ├── cafe.html
    ├── restaurant.html
    ├── index.html
    ├── uploads/          ← boş klasör yeterli
    ├── css/
    └── js/
```

### 1.3 ZIP'le
`node_modules/` ve `.git/` dışındaki her şeyi ZIP'le:
```
# Windows'ta sağ tık > 7-Zip veya PowerShell:
Compress-Archive -Path * -Exclude node_modules,.git -DestinationPath deploy.zip
```

---

## ADIM 2 – cPanel'de Node.js Uygulaması Oluştur

1. **cPanel** → **Software** → **Setup Node.js App**
2. **Create Application** tıkla
3. Ayarları şu şekilde doldur:

| Alan | Değer |
|------|-------|
| Node.js version | **18.x** (veya en yüksek >=18) |
| Application mode | **Production** |
| Application root | `qrmenu` *(sunucudaki klasör adı)* |
| Application URL | `alanadi.com` veya `alanadi.com/qrmenu` |
| Application startup file | `server.js` |

4. **Create** tıkla → cPanel uygulamayı oluşturur.

---

## ADIM 3 – Dosyaları Yükle

### Seçenek A – File Manager (kolay)
1. cPanel → **File Manager** → `public_html/qrmenu/` klasörünü oluştur
2. `deploy.zip` dosyasını yükle
3. ZIP üzerine sağ tık → **Extract**

### Seçenek B – FTP (FileZilla)
1. cPanel → **FTP Accounts** → FTP bilgilerini al
2. FileZilla ile `public_html/qrmenu/` klasörüne tüm dosyaları yükle

### Seçenek C – SSH + Git (en hızlı)
```bash
ssh kullanici@alanadi.com
cd public_html
git clone https://github.com/kullanici/qrmenu.git qrmenu
```

---

## ADIM 4 – Environment Variables Ekle

1. cPanel → **Setup Node.js App** → uygulamana tıkla → **Edit**
2. **Environment variables** bölümüne:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | `uzun-rastgele-sifre-buraya` |

> `.env` dosyasını da yüklediysen bu adım opsiyoneldir, ama cPanel üzerinden ayarlamak daha güvenlidir.

---

## ADIM 5 – npm install Çalıştır

cPanel → **Setup Node.js App** → uygulamana tıkla:

**Seçenek A – cPanel içinden (buton):**
→ **Run NPM Install** butonuna tıkla

**Seçenek B – SSH:**
```bash
cd ~/public_html/qrmenu
source /home/kullanici/nodevenv/qrmenu/18/bin/activate
npm install --production
```

---

## ADIM 6 – Uygulamayı Başlat

cPanel → **Setup Node.js App** → **Start** / **Restart** butonu

Uygulama çalışırsa status `Running` gösterir.

---

## ADIM 7 – Uploads Klasörü Yazma İzni

SSH ile:
```bash
chmod 755 ~/public_html/qrmenu/public/uploads
chmod 755 ~/public_html/qrmenu/data
```
File Manager ile: `uploads/` ve `data/` klasörlerine sağ tık → **Change Permissions** → `755`

---

## ADIM 8 – HTTPS & .htaccess (Opsiyonel)

Eğer alanın kök dizinine kuruyorsan `public_html/.htaccess` dosyasına ekle:
```apache
RewriteEngine On
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
```
> Passenger bunu otomatik yapabilir, ancak subdirectory'ye kuruyorsan elle gerekebilir.

---

## Kontrol Listesi

- [ ] `server.js` başında `require('dotenv').config();` var
- [ ] `package.json`'da `"engines": { "node": ">=18.0.0" }` var
- [ ] `dotenv` bağımlılıklar içinde var
- [ ] Sunucuya `.env` yüklendi veya cPanel'den env variables eklendi
- [ ] `node_modules/` yüklenmedi (sadece npm install ile oluşur)
- [ ] `data/menu.json` ve `data/settings.json` yüklendi
- [ ] `public/uploads/` klasörü oluşturuldu (boş olabilir)
- [ ] `npm install` çalıştırıldı
- [ ] Uygulama `Running` durumunda

---

## Sorun Giderme

**500 Error / Uygulama çalışmıyor:**
→ cPanel → Setup Node.js App → **stderr log** dosyasını kontrol et

**Session kaybolуyor / login çalışmıyor:**
→ `SESSION_SECRET` env değişkeninin ayarlı olduğunu kontrol et
→ HTTPS kullanıyorsan `secure: true` zaten otomatik açılıyor

**Resim yüklenemiyor:**
→ `public/uploads/` klasör izni `755` olmalı

**Port hatası:**
→ Namecheap Passenger PORT'u otomatik atar, `process.env.PORT` kullanıldığı için sorun olmamalı
