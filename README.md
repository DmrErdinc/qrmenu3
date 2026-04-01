# 🍽️ QR Menü Uygulaması

Modern, responsive ve kullanıcı dostu dijital menü yönetim sistemi. Restoranlar ve kafeler için özel olarak tasarlanmış, QR kod ile erişilebilen web tabanlı menü çözümü.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

---

## 📸 Ekran Görüntüleri

### 🏠 Ana Sayfa
Modern ve şık ana sayfa tasarımı ile müşterilerinizi karşılayın.

![Ana Sayfa](https://via.placeholder.com/800x450/1a1a1a/d4af37?text=Ana+Sayfa)

### ☕ Cafe Menü
Kahve ve içeceklerinizi kategorilere ayırarak sunun.

![Cafe Menü](https://via.placeholder.com/800x450/f5f5f0/1a1a1a?text=Cafe+Menu)

### 🍴 Restaurant Menü
Yemeklerinizi görsel ve açıklamalarıyla sergileyin.

![Restaurant Menü](https://via.placeholder.com/800x450/ffffff/2c2c2c?text=Restaurant+Menu)

### 🎛️ Admin Paneli
Güçlü ve kullanıcı dostu admin paneli ile menünüzü kolayca yönetin.

![Admin Paneli](https://via.placeholder.com/800x450/d4af37/1a1a1a?text=Admin+Panel)

### 📱 Mobil Uyumlu
Tüm cihazlarda mükemmel görünüm.

![Mobil Görünüm](https://via.placeholder.com/400x700/1a1a1a/ffffff?text=Mobile+View)

---

## ✨ Özellikler

### 🎨 Kullanıcı Arayüzü
- ✅ Modern ve şık tasarım
- ✅ Tam responsive (mobil, tablet, desktop)
- ✅ Smooth animasyonlar ve geçişler
- ✅ Kolay navigasyon
- ✅ QR kod ile hızlı erişim
- ✅ Arama ve filtreleme özellikleri

### 🛠️ Admin Paneli
- ✅ Güvenli giriş sistemi
- ✅ Ürün ekleme/düzenleme/silme
- ✅ Kategori yönetimi
- ✅ Görsel yükleme (dosya veya URL)
- ✅ Fiyat ve açıklama yönetimi
- ✅ Aktif/pasif ürün kontrolü
- ✅ Sıralama ve etiketleme
- ✅ Site ayarları (logo, favicon, otel adı)
- ✅ Google Review linki entegrasyonu

### 🔧 Teknik Özellikler
- ✅ Node.js & Express.js backend
- ✅ Session tabanlı kimlik doğrulama
- ✅ JSON dosya tabanlı veri yönetimi
- ✅ Multer ile dosya yükleme
- ✅ Cookie-parser ile session yönetimi
- ✅ RESTful API yapısı
- ✅ Güvenli dosya yükleme (10MB limit)
- ✅ CORS desteği

### 📊 İstatistikler
- ✅ Toplam ürün sayısı
- ✅ Aktif/pasif ürün takibi
- ✅ Kategori bazlı raporlama
- ✅ Cafe ve restaurant ayrımı

---

## 🚀 Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone https://github.com/yourusername/qr-menu.git
cd qr-menu
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Uygulamayı başlatın**
```bash
npm start
```

4. **Tarayıcıda açın**
```
http://localhost:3000
```

---

## 📁 Proje Yapısı

```
qr-menu/
├── 📂 data/                    # Veri dosyaları
│   ├── admins.json            # Admin kullanıcıları
│   ├── menu.json              # Menü verileri
│   └── settings.json          # Site ayarları
├── 📂 public/                 # Statik dosyalar
│   ├── 📂 css/                # Stil dosyaları
│   │   ├── style.css          # Ana stil
│   │   └── admin.css          # Admin paneli stili
│   ├── 📂 js/                 # JavaScript dosyaları
│   │   ├── cafe.js            # Cafe menü
│   │   ├── restaurant.js      # Restaurant menü
│   │   └── admin.js           # Admin paneli
│   ├── 📂 uploads/            # Yüklenen görseller
│   ├── index.html             # Ana sayfa
│   ├── cafe.html              # Cafe menü sayfası
│   ├── restaurant.html        # Restaurant menü sayfası
│   ├── admin.html             # Admin giriş
│   └── admin-dashboard.html   # Admin paneli
├── server.js                  # Express sunucu
├── package.json               # Proje bağımlılıkları
└── README.md                  # Bu dosya
```

---

## 🔐 Admin Paneli

### Varsayılan Giriş Bilgileri
```
Kullanıcı Adı: admin
Şifre: nava2024
```

⚠️ **Güvenlik:** İlk kurulumdan sonra şifreyi mutlaka değiştirin!

### Admin Paneli Özellikleri

#### 📊 Dashboard
- Toplam ürün sayısı
- Aktif/pasif ürün istatistikleri
- Kategori sayısı
- Cafe ve restaurant ürün dağılımı

#### 🍽️ Menü Yönetimi
- Ürün ekleme/düzenleme/silme
- Görsel yükleme (dosya veya URL)
- Kategori atama
- Fiyat belirleme
- Açıklama ekleme
- Etiket (tag) ekleme
- Sıralama ayarı
- Aktif/pasif durumu

#### 📁 Kategori Yönetimi
- Kategori ekleme/düzenleme/silme
- Cafe ve restaurant ayrımı
- Sıralama ayarı

#### ⚙️ Site Ayarları
- Otel/restaurant adı
- Logo yükleme
- Favicon yükleme
- Google Review linki

---

## 🎯 Kullanım

### Müşteri Tarafı

1. **QR Kod Tarama**
   - Masadaki QR kodu tarayın
   - Otomatik olarak menüye yönlendirilirsiniz

2. **Menü Gezinme**
   - Cafe veya Restaurant menüsünü seçin
   - Kategorilere göre filtreleyin
   - Arama yapın
   - Ürün detaylarını görüntüleyin

3. **Ürün Detayları**
   - Ürün görseli
   - Açıklama
   - Fiyat
   - Özel etiketler (Yeni, Popüler, vb.)

### Admin Tarafı

1. **Giriş Yapma**
   - `/admin.html` adresine gidin
   - Kullanıcı adı ve şifre ile giriş yapın

2. **Ürün Ekleme**
   - Cafe veya Restaurant menüsünü seçin
   - "Ürün Ekle" butonuna tıklayın
   - Bilgileri doldurun
   - Görsel yükleyin (dosya veya URL)
   - Kaydedin

3. **Ürün Düzenleme**
   - Ürünün yanındaki "Düzenle" butonuna tıklayın
   - Bilgileri güncelleyin
   - Kaydedin

4. **Kategori Yönetimi**
   - "Kategoriler" sekmesine gidin
   - Yeni kategori ekleyin veya mevcut kategorileri düzenleyin

5. **Site Ayarları**
   - "Ayarlar" sekmesine gidin
   - Logo, favicon ve diğer ayarları yapın

---

## 🌐 Deployment

### Vercel (Önerilen)
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Heroku
```bash
heroku create qr-menu
git push heroku main
```

### Namecheap Node.js Hosting
Detaylı kurulum için [`NAMECHEAP-NODEJS-KURULUM.md`](NAMECHEAP-NODEJS-KURULUM.md) dosyasına bakın.

---

## 🔧 Yapılandırma

### Environment Variables
```env
PORT=3000
NODE_ENV=production
SESSION_SECRET=your-secret-key-here
```

### Port Ayarı
`server.js` dosyasında:
```javascript
const PORT = process.env.PORT || 3000;
```

### Session Secret
Güvenlik için session secret'ı değiştirin:
```javascript
app.use(session({
    secret: 'your-very-secure-random-string',
    // ...
}));
```

---

## 📱 QR Kod Oluşturma

Menünüz için QR kod oluşturmak için:

1. [QR Code Generator](https://www.qr-code-generator.com/) gibi bir site kullanın
2. URL'nizi girin: `https://yourdomain.com`
3. QR kodu indirin
4. Masalarınıza yerleştirin

---

## 🛡️ Güvenlik

### Öneriler
- ✅ Admin şifresini güçlü yapın
- ✅ SESSION_SECRET'ı değiştirin
- ✅ HTTPS kullanın (SSL sertifikası)
- ✅ Dosya yükleme limitlerini ayarlayın
- ✅ Düzenli yedekleme yapın

### Dosya Yükleme Güvenliği
- Sadece görsel dosyaları kabul edilir
- Maksimum dosya boyutu: 10MB
- Desteklenen formatlar: JPG, PNG, GIF, WEBP, SVG

---

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 👨‍💻 Geliştirici

**The Nava Hotel**
- Website: [thehotelnava.com](https://thehotelnava.com)
- Email: info@thehotelnava.com

---

## 🙏 Teşekkürler

Bu projeyi kullandığınız için teşekkür ederiz! Sorularınız veya önerileriniz için lütfen issue açın.

---

## 📞 Destek

Sorun yaşıyorsanız:
1. [Issues](https://github.com/yourusername/qr-menu/issues) sayfasını kontrol edin
2. Yeni bir issue açın
3. Detaylı açıklama ve ekran görüntüsü ekleyin

---

## 🔄 Güncellemeler

### v1.0.0 (2024)
- ✅ İlk sürüm
- ✅ Cafe ve Restaurant menü desteği
- ✅ Admin paneli
- ✅ Görsel yükleme
- ✅ Kategori yönetimi
- ✅ Site ayarları
- ✅ Responsive tasarım

---

## 🎨 Özelleştirme

### Renk Teması
`public/css/style.css` dosyasında:
```css
:root {
    --primary-color: #1a1a1a;
    --secondary-color: #d4af37;
    --accent-color: #f5f5f0;
}
```

### Logo ve Favicon
Admin panelinden "Ayarlar" sekmesinden değiştirin.

---

## 📚 Dokümantasyon

- [Kurulum Rehberi](DEPLOYMENT.md)
- [Namecheap Kurulumu](NAMECHEAP-NODEJS-KURULUM.md)
- [API Dokümantasyonu](#) (Yakında)

---

## 🌟 Özellikler (Yakında)

- [ ] Çoklu dil desteği
- [ ] Online sipariş sistemi
- [ ] Masa rezervasyonu
- [ ] Ödeme entegrasyonu
- [ ] Müşteri yorumları
- [ ] Stok takibi
- [ ] Raporlama sistemi
- [ ] Mobil uygulama

---

<div align="center">

**⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın! ⭐**

Made with ❤️ by The Nava Hotel Team

</div>