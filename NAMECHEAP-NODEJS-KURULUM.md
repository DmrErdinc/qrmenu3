# Namecheap Node.js Hosting Kurulum Rehberi

## 🎯 Mevcut Durum
- ✅ Node.js hosting aktif
- ✅ Domain: qrmenuthehotelnava.com
- ⚠️ Paketler yanlış klasöre yüklendi

## 🔧 Doğru Kurulum Adımları

### 1. Doğru Klasöre Gidin

```bash
# Ana proje klasörüne git
cd /home/thehdagv/qrmenuthehotelnava.com

# Klasör içeriğini kontrol et
ls -la
```

### 2. package.json Dosyasını Yükleyin

Önce yerel bilgisayarınızdan `package.json` dosyasını sunucuya yükleyin.

**FileZilla veya cPanel File Manager ile:**
- Kaynak: `c:\Users\colem\Desktop\qrmenü\package.json`
- Hedef: `/home/thehdagv/qrmenuthehotelnava.com/package.json`

### 3. Tüm Proje Dosyalarını Yükleyin

**Yüklenecek dosyalar:**
```
/home/thehdagv/qrmenuthehotelnava.com/
├── package.json          ← ÖNEMLİ
├── package-lock.json
├── server.js            ← ÖNEMLİ
├── .htaccess
├── data/
│   ├── admins.json
│   ├── menu.json
│   └── settings.json
└── public/
    ├── index.html
    ├── admin.html
    ├── admin-dashboard.html
    ├── cafe.html
    ├── restaurant.html
    ├── css/
    │   ├── style.css
    │   └── admin.css
    ├── js/
    │   ├── cafe.js
    │   ├── restaurant.js
    │   └── admin.js
    └── uploads/
        └── .gitkeep
```

### 4. SSH ile Paketleri Yükleyin

```bash
# Proje klasörüne git
cd /home/thehdagv/qrmenuthehotelnava.com

# Node.js environment'ı aktifleştir
source /home/thehdagv/nodevenv/qrmenuthehotelnava.com/10/bin/activate

# Paketleri yükle
npm install

# Başarılı olursa göreceksiniz:
# added 50 packages...
```

### 5. Uygulamayı Başlatın

```bash
# Node.js uygulamasını başlat
node server.js

# Veya PM2 ile (önerilir)
npm install -g pm2
pm2 start server.js --name qrmenu
pm2 save
```

### 6. cPanel'den Başlatma (Alternatif)

1. cPanel → Setup Node.js App
2. Application root: `/home/thehdagv/qrmenuthehotelnava.com`
3. Application URL: `qrmenuthehotelnava.com`
4. Application startup file: `server.js`
5. "Run NPM Install" butonuna tıklayın
6. "Restart" butonuna tıklayın

---

## 📦 Hızlı Dosya Yükleme Komutu

Yerel bilgisayarınızdan (Windows PowerShell):

```powershell
# SCP ile tüm dosyaları yükle
scp -r c:\Users\colem\Desktop\qrmenü\* thehdagv@server86.web-hosting.com:/home/thehdagv/qrmenuthehotelnava.com/
```

Veya FileZilla ile:
1. Host: `sftp://server86.web-hosting.com`
2. Username: `thehdagv`
3. Password: [şifreniz]
4. Port: `22`
5. Tüm dosyaları sürükle-bırak

---

## 🔍 Kontrol Listesi

### Sunucuda Olması Gerekenler:

```bash
cd /home/thehdagv/qrmenuthehotelnava.com

# 1. package.json var mı?
cat package.json

# 2. server.js var mı?
cat server.js

# 3. node_modules var mı?
ls -la node_modules

# 4. Klasör yapısı doğru mu?
tree -L 2
```

---

## ⚙️ server.js Port Ayarı

Namecheap'in belirlediği portu kullanmalısınız. `server.js` dosyasını kontrol edin:

```javascript
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
```

---

## 🚀 Başlatma Komutları

### Yöntem 1: Direkt Node.js
```bash
cd /home/thehdagv/qrmenuthehotelnava.com
source /home/thehdagv/nodevenv/qrmenuthehotelnava.com/10/bin/activate
node server.js
```

### Yöntem 2: PM2 (Önerilen)
```bash
cd /home/thehdagv/qrmenuthehotelnava.com
source /home/thehdagv/nodevenv/qrmenuthehotelnava.com/10/bin/activate
pm2 start server.js --name qrmenu
pm2 startup
pm2 save
```

### Yöntem 3: cPanel (En Kolay)
1. cPanel → Setup Node.js App
2. "Restart" butonuna tıklayın

---

## 🧪 Test

```bash
# Uygulama çalışıyor mu?
curl http://localhost:3000

# Port dinleniyor mu?
netstat -tulpn | grep :3000

# PM2 status
pm2 status

# Logları kontrol et
pm2 logs qrmenu
```

Web'den test:
- `http://qrmenuthehotelnava.com`
- `http://qrmenuthehotelnava.com/admin.html`

---

## 🆘 Sorun Giderme

### "package.json bulunamadı" hatası
```bash
# Doğru klasörde misiniz?
pwd
# Çıktı: /home/thehdagv/qrmenuthehotelnava.com olmalı

# package.json var mı?
ls -la package.json
```

### "Port kullanımda" hatası
```bash
# Port'u kullanan process'i bul
lsof -i :3000

# Process'i durdur
kill -9 [PID]
```

### "npm install" çalışmıyor
```bash
# Node.js versiyonunu kontrol et
node --version
npm --version

# Cache'i temizle
npm cache clean --force

# Tekrar dene
npm install
```

---

## 📋 Tam Kurulum Scripti

Tüm adımları tek seferde:

```bash
#!/bin/bash

# 1. Klasöre git
cd /home/thehdagv/qrmenuthehotelnava.com

# 2. Environment aktifleştir
source /home/thehdagv/nodevenv/qrmenuthehotelnava.com/10/bin/activate

# 3. Paketleri yükle
npm install

# 4. Uploads klasörü izinleri
chmod 755 public/uploads

# 5. PM2 yükle
npm install -g pm2

# 6. Uygulamayı başlat
pm2 start server.js --name qrmenu

# 7. Otomatik başlatma
pm2 startup
pm2 save

# 8. Status kontrol
pm2 status

echo "✅ Kurulum tamamlandı!"
echo "🌐 Site: http://qrmenuthehotelnava.com"
```

Bu scripti `setup.sh` olarak kaydedin ve çalıştırın:
```bash
chmod +x setup.sh
./setup.sh
```

---

## ✅ Başarı Kriterleri

- [ ] package.json doğru klasörde
- [ ] npm install başarılı
- [ ] node_modules klasörü oluştu
- [ ] server.js çalışıyor
- [ ] Port 3000 dinleniyor
- [ ] Web'den erişilebiliyor
- [ ] Admin paneli açılıyor
- [ ] Görsel yükleme çalışıyor

---

## 🎯 Sonraki Adımlar

1. ✅ Dosyaları yükle
2. ✅ npm install çalıştır
3. ✅ Uygulamayı başlat
4. ✅ Test et
5. ✅ SSL sertifikası aktifleştir (cPanel → SSL/TLS)

**Başarılar! 🚀**