# Epica Manager

Güçlü proje ve görev yönetimi uygulaması - Next.js 14 ile geliştirildi.

🚀 **Live Demo**: https://epica.com.tr

## ✨ Özellikler

- ⚡ Next.js 14 ile modern React uygulaması
- 🗄️ PostgreSQL database ile Prisma ORM
- 📱 Responsive tasarım
- 🚀 TypeScript desteği
- 🔄 Otomatik deployment (DigitalOcean App Platform)
- 🎨 Modern UI/UX
- 📊 RESTful API endpoints
- 🔗 Webhook entegrasyonu (GitHub & DigitalOcean)
- ✅ **Auto-deployment hazır!** (2025-07-19)
- 📋 Webhook monitoring dashboard

## 🚀 Auto-Deployment Süreci

### GitHub → DigitalOcean Pipeline:
1. **Push to main**: GitHub'a kod push edilir
2. **Webhook trigger**: GitHub, webhook'u tetikler
3. **Build process**: DigitalOcean otomatik build başlatır
4. **Deploy**: Yeni version epica.com.tr'de live olur
5. **Monitoring**: Dashboard'da status görülür

### 📊 Monitoring Dashboard:
- **Deployment Status**: https://epica.com.tr/deploy
- **Webhook Events**: https://epica.com.tr/webhooks
- **Setup Guide**: https://epica.com.tr/webhook-setup

## 🔧 API Endpoints

- `GET /api/users` - Tüm kullanıcıları listele
- `POST /api/users` - Yeni kullanıcı oluştur
- `GET /api/tasks` - Tüm görevleri listele  
- `POST /api/tasks` - Yeni görev oluştur

### Webhook Endpoints
- `POST /api/webhook` - GitHub webhook events
- `POST /api/webhook/digitalocean` - DigitalOcean events
- `GET /api/webhook/test` - Webhook test endpoint

## 🛠️ Geliştirme

```bash
# Projeyi klonlayın
git clone https://github.com/ozmenkaya/manager.git
cd manager

# Bağımlılıkları yükleyin
npm install

# Environment variables
cp .env.example .env.local

# Database setup
npm run db:generate
npm run db:push

# Development server
npm run dev
```

## 🌐 Webhook Configuration

GitHub webhook kurulumu için:
- **URL**: `https://epica.com.tr/api/webhook`
- **Secret**: Environment variable'da tanımlı
- **Events**: Push, Pull requests, Deployments

## 📂 Teknolojiler

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **DigitalOcean** - Hosting

---

**Modern yönetim sistemi** - Otomatik deployment ile güçlendirildi 🚀
