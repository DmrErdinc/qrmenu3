# QR Menü Uygulaması - Hosting Yayınlama Rehberi

## 🚀 Node.js Hosting'e Yayınlama Adımları

### 1. Hosting Gereksinimleri
- Node.js desteği (v14 veya üzeri)
- npm/yarn desteği
- Dosya yükleme izni
- Port erişimi (genellikle 3000 veya hosting sağlayıcının belirlediği port)

### 2. Dosya Hazırlığı

#### A. `.gitignore` Dosyası Oluşturun
```
node_modules/
.env
*.log
.DS_Store
```

#### B. `package.json` Kontrol
Aşağıdaki script'lerin olduğundan emin olun:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 3. Hosting Sağlayıcıları ve Kurulum

#### A. **Vercel** (Önerilen - Ücretsiz)
1. [vercel.com](https://vercel.com) hesabı oluşturun
2. Vercel CLI yükleyin:
   ```bash
   npm install -g vercel
   ```
3. Proje klasöründe:
   ```bash
   vercel login
   vercel
   ```
4. Domain ayarları:
   - Vercel dashboard → Settings → Domains
   - `qrmenu.thehotelnava.com` ekleyin
   - DNS kayıtlarını güncelleyin (Vercel size gösterecek)

#### B. **Heroku** (Ücretsiz/Ücretli)
1. [heroku.com](https://heroku.com) hesabı oluşturun
2. Heroku CLI yükleyin
3. Proje klasöründe:
   ```bash
   heroku login
   heroku create qrmenu-nava
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```
4. Domain ayarları:
   - Heroku dashboard → Settings → Domains
   - Custom domain ekleyin

#### C. **Railway** (Önerilen - Kolay)
1. [railway.app](https://railway.app) hesabı oluşturun
2. "New Project" → "Deploy from GitHub"
3. Repo'nuzu seçin veya manuel deploy
4. Environment variables ekleyin
5. Domain ayarları yapın

#### D. **Render** (Ücretsiz)
1. [render.com](https://render.com) hesabı oluşturun
2. "New Web Service" oluşturun
3. GitHub repo bağlayın veya manuel upload
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Custom domain ekleyin

### 4. Ortam Değişkenleri (Environment Variables)

Hosting panelinde şu değişkenleri ekleyin:
```
PORT=3000
NODE_ENV=production
SESSION_SECRET=your-secret-key-here
```

### 5. DNS Ayarları (thehotelnava.com için)

Domain sağlayıcınızda (GoDaddy, Namecheap, vb.) şu kayıtları ekleyin:

#### A. Subdomain için (qrmenu.thehotelnava.com)
```
Type: CNAME
Name: qrmenu
Value: [hosting-sağlayıcının-adresi]
TTL: 3600
```

#### B. Vercel için örnek:
```
Type: CNAME
Name: qrmenu
Value: cname.vercel-dns.com
```

#### C. Heroku için örnek:
```
Type: CNAME
Name: qrmenu
Value: qrmenu-nava.herokuapp.com
```

### 6. Dosya Yükleme Klasörü

Hosting'de `public/uploads` klasörünün yazılabilir olduğundan emin olun:
```bash
chmod 755 public/uploads
```

### 7. Production Ayarları

#### `server.js` güncellemesi:
```javascript
const PORT = process.env.PORT || 3000;
```

### 8. Test ve Kontrol

Yayınlandıktan sonra kontrol edin:
- ✅ Ana sayfa yükleniyor mu?
- ✅ Admin paneli çalışıyor mu?
- ✅ Görsel yükleme çalışıyor mu?
- ✅ Menü sayfaları açılıyor mu?
- ✅ Mobil uyumlu mu?

### 9. SSL Sertifikası

Çoğu modern hosting otomatik SSL sağlar:
- Vercel: Otomatik
- Heroku: Otomatik
- Railway: Otomatik
- Render: Otomatik

### 10. Güvenlik Kontrolleri

- ✅ Admin şifresi güçlü olmalı
- ✅ Session secret değiştirilmeli
- ✅ HTTPS aktif olmalı
- ✅ Dosya yükleme limitleri ayarlanmalı

## 📋 Hızlı Başlangıç (Vercel ile)

```bash
# 1. Vercel CLI yükle
npm install -g vercel

# 2. Proje klasörüne git
cd c:\Users\colem\Desktop\qrmenü

# 3. Vercel'e deploy et
vercel

# 4. Production'a deploy et
vercel --prod

# 5. Domain ekle (Vercel dashboard'dan)
```

## 🔧 Sorun Giderme

### Port Hatası
```javascript
// server.js'de
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
```

### Dosya Yükleme Hatası
- Hosting'in dosya yükleme limitini kontrol edin
- `public/uploads` klasörü yazılabilir olmalı

### Session Hatası
- `SESSION_SECRET` environment variable ekleyin
- Cookie ayarlarını kontrol edin

## 📞 Destek

Sorun yaşarsanız:
1. Hosting sağlayıcının dokümantasyonunu kontrol edin
2. Log dosyalarını inceleyin
3. Environment variables'ları kontrol edin

## 🎯 Önerilen Hosting: Vercel

**Neden Vercel?**
- ✅ Ücretsiz
- ✅ Otomatik SSL
- ✅ Kolay deployment
- ✅ Hızlı CDN
- ✅ Custom domain desteği
- ✅ Otomatik ölçeklendirme

**Alternatifler:**
- Railway (Kolay, modern)
- Render (Ücretsiz, güvenilir)
- Heroku (Popüler, ücretli)