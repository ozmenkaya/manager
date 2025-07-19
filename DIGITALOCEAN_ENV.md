# 🚀 DigitalOcean Environment Variables Kurulum Rehberi

## 📋 Gerekli Environment Variables

DigitalOcean App Platform'da aşağıdaki environment variables'ları eklemeniz gerekiyor:

### 1. GitHub Webhook Secret
```
GITHUB_WEBHOOK_SECRET = I%];39A7y)3N-_qPK/m&mGl.]MXe[ZH4*v*^P5:Qfqlt&[)6{$mUgaUsDvowFU5
```

### 2. Database URL
```
DATABASE_URL = postgresql://username:password@host:port/database
```

### 3. Application URL
```
APP_URL = https://epica.com.tr
```

### 4. NextAuth Configuration (gelecek için)
```
NEXTAUTH_SECRET = your-nextauth-secret-key
NEXTAUTH_URL = https://epica.com.tr
```

## 🔧 DigitalOcean'da Environment Variables Ekleme

### Adım 1: App Dashboard
1. DigitalOcean dashboard'a gidin
2. Apps sekmesini açın
3. "manager" uygulamanızı seçin

### Adım 2: Settings
1. "Settings" sekmesine gidin
2. Sol menüden "App-Level Environment Variables" seçin

### Adım 3: Variables Ekleme
1. "Edit" butonuna tıklayın
2. Her bir environment variable için:
   - Key: Variable adı (örn: GITHUB_WEBHOOK_SECRET)
   - Value: Variable değeri
   - Encrypt: ✅ (güvenlik için)

### Adım 4: Deploy
Environment variables eklendikten sonra:
1. "Save" butonuna tıklayın
2. App otomatik olarak yeniden deploy edilecek
3. Deploy tamamlandıktan sonra webhook'lar çalışmaya başlayacak

## ✅ Doğrulama

Environment variables doğru kurulduysa:
- GitHub webhook'ları çalışacak
- Signature validation başarılı olacak
- `/api/webhook/test` endpoint'i çalışacak

## 🔍 Hata Giderme

Eğer webhook'lar çalışmıyorsa:
1. Environment variables'ları kontrol edin
2. App'i yeniden deploy edin
3. Webhook test endpoint'ini deneyin
4. DigitalOcean logs'ları kontrol edin
