# GitHub'a Yükleme Rehberi

## 🚀 Hızlı Yükleme (Komut Satırı)

### 1. Git Kurulumu Kontrolü

```bash
# Git yüklü mü kontrol et
git --version

# Eğer yüklü değilse: https://git-scm.com/download/win
```

### 2. Proje Klasörüne Git

```bash
cd C:\Users\colem\Desktop\qrmenü
```

### 3. Git Repository Başlat

```bash
# Git repository'yi başlat
git init

# Tüm dosyaları ekle
git add .

# İlk commit
git commit -m "Initial commit: QR Menu Application"
```

### 4. GitHub Repository'ye Bağlan

```bash
# Remote repository ekle
git remote add origin https://github.com/DmrErdinc/qrmenu2.git

# Branch adını main yap
git branch -M main

# GitHub'a yükle
git push -u origin main
```

---

## 🔐 GitHub Authentication

### Yöntem 1: Personal Access Token (Önerilen)

1. **GitHub'da Token Oluştur:**
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - "Generate new token (classic)" tıkla
   - Scope: `repo` seç
   - Token'ı kopyala

2. **Push yaparken:**
   ```bash
   git push -u origin main
   ```
   - Username: `DmrErdinc`
   - Password: `[token'ınızı yapıştırın]`

### Yöntem 2: GitHub Desktop (En Kolay)

1. [GitHub Desktop](https://desktop.github.com/) indir ve yükle
2. GitHub hesabınla giriş yap
3. File → Add Local Repository
4. `C:\Users\colem\Desktop\qrmenü` klasörünü seç
5. "Publish repository" butonuna tıkla
6. Repository name: `qrmenu2`
7. "Publish repository" tıkla

---

## 📝 Tam Komut Listesi

```bash
# 1. Proje klasörüne git
cd C:\Users\colem\Desktop\qrmenü

# 2. Git başlat
git init

# 3. Kullanıcı bilgilerini ayarla (ilk kez yapıyorsanız)
git config --global user.name "DmrErdinc"
git config --global user.email "your-email@example.com"

# 4. Dosyaları ekle
git add .

# 5. Commit yap
git commit -m "Initial commit: QR Menu Application"

# 6. Remote ekle
git remote add origin https://github.com/DmrErdinc/qrmenu2.git

# 7. Branch adını main yap
git branch -M main

# 8. Push yap
git push -u origin main
```

---

## 🔄 Güncelleme Yapmak

Kodlarınızı değiştirdikten sonra:

```bash
# 1. Değişiklikleri ekle
git add .

# 2. Commit yap
git commit -m "Açıklama: Ne değiştirdiniz"

# 3. GitHub'a yükle
git push
```

---

## 🆘 Sorun Giderme

### "Repository already exists" hatası

```bash
# Mevcut remote'u kaldır
git remote remove origin

# Yeni remote ekle
git remote add origin https://github.com/DmrErdinc/qrmenu2.git

# Push yap
git push -u origin main
```

### "Authentication failed" hatası

1. Personal Access Token kullanın
2. Veya GitHub Desktop kullanın

### "fatal: not a git repository" hatası

```bash
# Git'i başlat
git init
```

### Büyük dosya hatası

```bash
# .gitignore'a ekle
echo "public/uploads/*.jpg" >> .gitignore
echo "public/uploads/*.png" >> .gitignore

# Commit yap
git add .gitignore
git commit -m "Update .gitignore"
```

---

## 📦 Yüklenecek Dosyalar

✅ **Yüklenecek:**
- `server.js`
- `package.json`
- `public/` klasörü
- `data/` klasörü
- `README.md`
- `.gitignore`
- Deployment dosyaları

❌ **Yüklenmeyecek (.gitignore):**
- `node_modules/`
- `.env`
- Log dosyaları
- Geçici dosyalar

---

## 🎯 GitHub Desktop ile Yükleme (Görsel)

### Adım 1: GitHub Desktop'ı Aç
![GitHub Desktop](https://desktop.github.com/images/desktop-icon.svg)

### Adım 2: Add Local Repository
- File → Add Local Repository
- Choose: `C:\Users\colem\Desktop\qrmenü`

### Adım 3: Publish
- "Publish repository" butonuna tıkla
- Name: `qrmenu2`
- Description: "QR Menu Application for Restaurants"
- ✅ Keep this code private (özel tutmak için)
- "Publish repository" tıkla

### Adım 4: Tamamlandı!
Repository: `https://github.com/DmrErdinc/qrmenu2`

---

## 🔗 Repository Linki

Yükleme tamamlandıktan sonra:
```
https://github.com/DmrErdinc/qrmenu2
```

---

## 📊 Repository Ayarları

### README Görünümü
- GitHub otomatik olarak README.md'yi gösterecek
- Ekran görüntüleri için `screenshots/` klasörü oluşturun

### Topics Ekleyin
Repository → Settings → Topics:
- `nodejs`
- `express`
- `qr-menu`
- `restaurant`
- `menu-management`
- `digital-menu`

### About Bölümü
Repository → About → Edit:
- Description: "Modern QR Menu Application for Restaurants and Cafes"
- Website: `https://qrmenuthehotelnava.com`
- Topics: Yukarıdaki topics'leri ekleyin

---

## 🎉 Başarılı!

Repository'niz artık yayında:
```
https://github.com/DmrErdinc/qrmenu2
```

Paylaşabilir, klonlayabilir ve katkıda bulunabilirsiniz!

---

## 📱 Clone Etmek

Başka bir bilgisayarda kullanmak için:

```bash
git clone https://github.com/DmrErdinc/qrmenu2.git
cd qrmenu2
npm install
npm start
```

---

## 🔐 Private Repository

Repository'yi özel yapmak için:
1. Repository → Settings
2. Danger Zone → Change visibility
3. "Make private" seç

---

## 📞 Destek

Sorun yaşarsanız:
1. GitHub Desktop kullanın (en kolay)
2. Personal Access Token kullanın
3. SSH key ekleyin (gelişmiş)

**Başarılar! 🚀**