# 🚀 Namecheap ile QR Menü Yayınlama - Basit Yöntem

## ⚠️ ÖNEMLİ BİLGİ

Namecheap **shared hosting** Node.js'i desteklemez. Ancak **ÜCRETSİZ** ve **KOLAY** bir çözüm var!

---

## 🎯 EN KOLAY ÇÖZÜM (5 Dakika)

### Adım 1: Vercel'de Ücretsiz Hosting (3 dakika)

```bash
# Terminal'i açın (Windows: cmd veya PowerShell)

# 1. Vercel CLI yükleyin
npm install -g vercel

# 2. Proje klasörüne gidin
cd c:\Users\colem\Desktop\qrmenü

# 3. Vercel'e login olun (tarayıcı açılacak)
vercel login

# 4. Deploy edin (sorulara Enter basın)
vercel

# 5. Production'a deploy edin
vercel --prod
```

**Sonuç:** Vercel size bir URL verecek: `https://qrmenu-xxx.vercel.app`

---

### Adım 2: Namecheap DNS Ayarları (2 dakika)

1. **Namecheap'e giriş yapın**
   - [namecheap.com](https://namecheap.com) → Dashboard
   - `thehotelnava.com` domain'ini bulun
   - "Manage" butonuna tıklayın

2. **Advanced DNS** sekmesine gidin

3. **"ADD NEW RECORD" butonuna tıklayın**

4. **Şu bilgileri girin:**
   ```
   Type: CNAME Record
   Host: qrmenu
   Value: cname.vercel-dns.com
   TTL: Automatic
   ```

5. **✓ (Tik) işaretine tıklayın** (Kaydet)

6. **Bekleyin** (5-30 dakika DNS yayılması için)

---

### Adım 3: Vercel'de Domain Bağlama (1 dakika)

1. **Vercel Dashboard'a gidin**
   - [vercel.com/dashboard](https://vercel.com/dashboard)
   - Projenizi seçin

2. **Settings → Domains** sekmesine gidin

3. **"Add" butonuna tıklayın**

4. **Domain girin:**
   ```
   qrmenu.thehotelnava.com
   ```

5. **"Add" butonuna tıklayın**

6. Vercel otomatik SSL sertifikası oluşturacak

---

## ✅ TAMAMLANDI!

Artık siteniz şu adreste yayında:
```
https://qrmenu.thehotelnava.com
```

**Test edin:**
- Ana sayfa: `https://qrmenu.thehotelnava.com`
- Admin: `https://qrmenu.thehotelnava.com/admin.html`
- Cafe: `https://qrmenu.thehotelnava.com/cafe.html`
- Restaurant: `https://qrmenu.thehotelnava.com/restaurant.html`

---

## 🎁 Vercel'in Avantajları

✅ **Tamamen Ücretsiz**
✅ **Otomatik SSL** (HTTPS)
✅ **Hızlı CDN** (Dünya çapında)
✅ **Otomatik Yedekleme**
✅ **Sınırsız Bant Genişliği**
✅ **Kolay Güncelleme** (sadece `vercel --prod`)
✅ **99.9% Uptime**

---

## 🔄 Güncelleme Nasıl Yapılır?

Kodlarınızı değiştirdiğinizde:

```bash
# Proje klasörüne git
cd c:\Users\colem\Desktop\qrmenü

# Yeni versiyonu yükle
vercel --prod
```

**O kadar!** Değişiklikler 30 saniye içinde yayında olacak.

---

## 🆘 Sorun Giderme

### "DNS yayılmadı" hatası
- 30 dakika bekleyin
- Tarayıcı cache'ini temizleyin (Ctrl+Shift+Delete)
- Farklı tarayıcıda deneyin

### "Domain eklenemiyor" hatası
- Namecheap DNS ayarlarını kontrol edin
- CNAME kaydının doğru olduğundan emin olun
- 1 saat bekleyin

### "Vercel login olmuyor" hatası
- VPN kapalı olduğundan emin olun
- Farklı tarayıcı deneyin
- `vercel logout` sonra `vercel login` yapın

---

## 📱 Mobil Test

QR kod oluşturun:
```
https://qrmenu.thehotelnava.com
```

Telefonunuzdan tarayın ve test edin!

---

## 🔐 Güvenlik

- ✅ Otomatik HTTPS
- ✅ DDoS koruması
- ✅ Güvenli dosya yükleme
- ⚠️ Admin şifresini değiştirin: `data/admins.json`

---

## 💰 Maliyet

**TOPLAM: 0 TL**

- Vercel: Ücretsiz
- Namecheap: Sadece domain (zaten var)
- SSL: Ücretsiz (Vercel otomatik)

---

## 🎯 Özet

1. ✅ `npm install -g vercel`
2. ✅ `vercel login`
3. ✅ `vercel --prod`
4. ✅ Namecheap DNS: CNAME ekle
5. ✅ Vercel: Domain ekle
6. ✅ 30 dakika bekle
7. ✅ Test et!

**Başarılar! 🎉**