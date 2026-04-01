# Namecheap Hosting'e Node.js Uygulaması Yükleme Rehberi

## 🎯 Namecheap için Özel Kurulum

### ⚠️ ÖNEMLİ: Namecheap Shared Hosting Sınırlamaları

Namecheap'in standart shared hosting planları **Node.js'i desteklemez**. İki seçeneğiniz var:

#### Seçenek 1: Namecheap VPS (Önerilen)
- VPS hosting gereklidir
- Node.js kurulumu yapılabilir
- Tam kontrol

#### Seçenek 2: Hybrid Çözüm (Daha Kolay)
- Node.js uygulamasını **ücretsiz hosting**'de çalıştırın (Vercel/Railway)
- Namecheap'i sadece **domain yönetimi** için kullanın
- DNS ayarlarıyla bağlayın

---

## 🚀 ÖNERİLEN ÇÖZÜM: Hybrid Yaklaşım

### Adım 1: Vercel'de Ücretsiz Hosting

```bash
# 1. Vercel CLI yükle
npm install -g vercel

# 2. Proje klasörüne git
cd c:\Users\colem\Desktop\qrmenü

# 3. Vercel'e login ol
vercel login

# 4. Deploy et
vercel

# 5. Production'a deploy et
vercel --prod
```

Vercel size bir URL verecek: `https://qrmenu-xxx.vercel.app`

### Adım 2: Namecheap DNS Ayarları

1. **Namecheap'e giriş yapın**
   - [namecheap.com](https://namecheap.com) → Dashboard
   - `thehotelnava.com` domain'ini seçin

2. **Advanced DNS sekmesine gidin**

3. **Yeni CNAME kaydı ekleyin:**
   ```
   Type: CNAME Record
   Host: qrmenu
   Value: cname.vercel-dns.com
   TTL: Automatic
   ```

4. **Kaydet** butonuna tıklayın

5. **DNS yayılmasını bekleyin** (5-30 dakika)

### Adım 3: Vercel'de Custom Domain Ekle

1. Vercel Dashboard → Projeniz → Settings → Domains
2. "Add Domain" butonuna tıklayın
3. `qrmenu.thehotelnava.com` yazın
4. "Add" butonuna tıklayın
5. Vercel otomatik SSL sertifikası oluşturacak

### ✅ Tamamlandı!

`https://qrmenu.thehotelnava.com` artık çalışıyor olmalı!

---

## 🔧 Alternatif: Namecheap VPS Kullanımı

Eğer VPS hosting'iniz varsa:

### 1. VPS'e Bağlanın

```bash
ssh root@your-vps-ip
```

### 2. Node.js Yükleyin

```bash
# Node.js 18.x yükle
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Versiyonu kontrol et
node --version
npm --version
```

### 3. PM2 Yükleyin (Process Manager)

```bash
sudo npm install -g pm2
```

### 4. Projeyi Yükleyin

```bash
# Proje klasörü oluştur
mkdir -p /var/www/qrmenu
cd /var/www/qrmenu

# Dosyaları yükle (FTP veya Git ile)
# Örnek: Git kullanarak
git clone your-repo-url .

# Bağımlılıkları yükle
npm install
```

### 5. PM2 ile Başlat

```bash
# Uygulamayı başlat
pm2 start server.js --name qrmenu

# Otomatik başlatma
pm2 startup
pm2 save
```

### 6. Nginx Reverse Proxy Kurulumu

```bash
# Nginx yükle
sudo apt-get install nginx

# Nginx yapılandırması
sudo nano /etc/nginx/sites-available/qrmenu
```

Aşağıdaki içeriği ekleyin:

```nginx
server {
    listen 80;
    server_name qrmenu.thehotelnava.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Siteyi aktifleştir
sudo ln -s /etc/nginx/sites-available/qrmenu /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. SSL Sertifikası (Let's Encrypt)

```bash
# Certbot yükle
sudo apt-get install certbot python3-certbot-nginx

# SSL sertifikası al
sudo certbot --nginx -d qrmenu.thehotelnava.com

# Otomatik yenileme
sudo certbot renew --dry-run
```

### 8. Namecheap DNS Ayarları (VPS için)

```
Type: A Record
Host: qrmenu
Value: [VPS-IP-ADRESINIZ]
TTL: Automatic
```

---

## 📋 Dosya Yükleme Yöntemleri

### Yöntem 1: FTP/SFTP (FileZilla)

1. FileZilla'yı indirin
2. Bağlantı bilgileri:
   - Host: `sftp://your-vps-ip` veya FTP adresi
   - Username: root veya FTP kullanıcı adı
   - Password: şifreniz
   - Port: 22 (SFTP) veya 21 (FTP)

3. Tüm dosyaları `/var/www/qrmenu` klasörüne yükleyin

### Yöntem 2: Git

```bash
# VPS'te
cd /var/www/qrmenu
git clone https://github.com/your-username/qrmenu.git .
```

### Yöntem 3: SCP (Komut Satırı)

```bash
# Yerel bilgisayarınızdan
scp -r c:\Users\colem\Desktop\qrmenü/* root@your-vps-ip:/var/www/qrmenu/
```

---

## 🔐 Güvenlik Ayarları

### 1. Firewall Ayarları

```bash
# UFW yükle ve aktifleştir
sudo apt-get install ufw
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. Environment Variables

```bash
# .env dosyası oluştur
nano /var/www/qrmenu/.env
```

İçeriği:
```
PORT=3000
NODE_ENV=production
SESSION_SECRET=your-very-secure-random-string-here
```

### 3. Dosya İzinleri

```bash
# Uploads klasörü
chmod 755 /var/www/qrmenu/public/uploads
chown -R www-data:www-data /var/www/qrmenu/public/uploads
```

---

## 🧪 Test ve Kontrol

### Uygulama Çalışıyor mu?

```bash
# PM2 status
pm2 status

# Logları kontrol et
pm2 logs qrmenu

# Nginx status
sudo systemctl status nginx

# Port dinleniyor mu?
sudo netstat -tulpn | grep :3000
```

### Web'den Test

1. `http://qrmenu.thehotelnava.com` → Ana sayfa
2. `http://qrmenu.thehotelnava.com/admin.html` → Admin paneli
3. `http://qrmenu.thehotelnava.com/cafe.html` → Cafe menü
4. `http://qrmenu.thehotelnava.com/restaurant.html` → Restaurant menü

---

## 🆘 Sorun Giderme

### Port 3000 kullanımda hatası

```bash
# Port'u kullanan process'i bul
sudo lsof -i :3000

# Process'i durdur
sudo kill -9 [PID]
```

### PM2 başlamıyor

```bash
# PM2'yi yeniden başlat
pm2 restart qrmenu

# Tüm process'leri durdur ve başlat
pm2 delete all
pm2 start server.js --name qrmenu
```

### Nginx hatası

```bash
# Nginx yapılandırmasını test et
sudo nginx -t

# Nginx'i yeniden başlat
sudo systemctl restart nginx

# Nginx loglarını kontrol et
sudo tail -f /var/log/nginx/error.log
```

### DNS yayılmadı

```bash
# DNS'i kontrol et
nslookup qrmenu.thehotelnava.com

# Veya
dig qrmenu.thehotelnava.com
```

---

## 📊 Karşılaştırma: Hybrid vs VPS

| Özellik | Hybrid (Vercel + Namecheap) | VPS |
|---------|----------------------------|-----|
| Maliyet | Ücretsiz | $5-20/ay |
| Kurulum | Çok Kolay (10 dk) | Orta (1-2 saat) |
| Bakım | Yok | Gerekli |
| Performans | Çok İyi (CDN) | İyi |
| Ölçeklendirme | Otomatik | Manuel |
| SSL | Otomatik | Manuel |
| Önerilen | ✅ Başlangıç için | Gelişmiş kullanıcılar |

---

## 🎯 Hızlı Başlangıç (Önerilen)

```bash
# 1. Vercel CLI yükle
npm install -g vercel

# 2. Deploy et
cd c:\Users\colem\Desktop\qrmenü
vercel --prod

# 3. Namecheap DNS'e CNAME ekle
# Host: qrmenu
# Value: cname.vercel-dns.com

# 4. Vercel'de domain ekle
# qrmenu.thehotelnava.com

# ✅ Tamamlandı!
```

---

## 📞 Destek

Sorun yaşarsanız:
1. PM2 loglarını kontrol edin: `pm2 logs`
2. Nginx loglarını kontrol edin: `sudo tail -f /var/log/nginx/error.log`
3. DNS yayılmasını bekleyin (30 dakika)
4. Firewall ayarlarını kontrol edin

## 🔗 Faydalı Linkler

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Namecheap Dashboard](https://ap.www.namecheap.com/)
- [PM2 Dokümantasyonu](https://pm2.keymetrics.io/)
- [Nginx Dokümantasyonu](https://nginx.org/en/docs/)