# Ep## Özellikler

- ⚡ Next.js 14 ile modern React uygulaması
- 🗄️ PostgreSQL database ile Prisma ORM
- 📱 Responsive tasarım
- 🚀 TypeScript desteği
- 🔄 Otomatik deployment (DigitalOcean App Platform)
- 🎨 Modern UI/UX
- 📊 RESTful API endpoints
- 🔗 Webhook entegrasyonu (GitHub & DigitalOcean)
- 📋 Webhook monitoring dashboarder

Modern yönetim sistemi - epica.com.tr | DigitalOcean App Platform ile otomatik deployment

## Özellikler

- ⚡ Next.js 14 ile modern React uygulaması
- �️ PostgreSQL database ile Prisma ORM
- �📱 Responsive tasarım
- 🚀 TypeScript desteği
- 🔄 Otomatik deployment (DigitalOcean App Platform)
- 🎨 Modern UI/UX
- 📊 RESTful API endpoints

## Geliştirme

Projeyi yerel ortamda çalıştırmak için:

```bash
# Bağımlılıkları yükle
npm install

# Environment variables dosyasını oluştur
cp .env.example .env.local

# Database URL'ini .env.local dosyasında güncelleyin
# DATABASE_URL="postgresql://username:password@localhost:5432/manager_db"

# Prisma client'ı generate et
npm run db:generate

# Database'i push et (geliştirme için)
npm run db:push

# Seed data ekle (opsiyonel)
npm run db:seed

# Geliştirme sunucusunu başlat
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacak.

## Deployment

Bu proje DigitalOcean App Platform için optimize edilmiştir. GitHub'a push yaptığınızda otomatik olarak deploy edilecek.

## 🚀 Auto-Deployment Süreci

### GitHub → DigitalOcean Pipeline:
1. **Push to main**: GitHub'a kod push edilir
2. **Webhook trigger**: GitHub, DigitalOcean'a webhook gönderir
3. **Build process**: DigitalOcean otomatik build başlatır
   - `npm install`
   - `npm run build`
   - `npx prisma generate`
   - `npx prisma db push`
4. **Deploy**: Yeni version epica.com.tr'de live olur
5. **Notification**: Webhook dashboard'da status görülür

### Monitoring:
- **Deployment Status**: https://epica.com.tr/deploy
- **Webhook Dashboard**: https://epica.com.tr/webhooks

### API Endpoints

- `GET /api/users` - Tüm kullanıcıları listele
- `POST /api/users` - Yeni kullanıcı oluştur
- `GET /api/tasks` - Tüm görevleri listele  
- `POST /api/tasks` - Yeni görev oluştur

### Webhook Endpoints

- `POST /api/webhook` - GitHub webhook events
- `POST /api/webhook/digitalocean` - DigitalOcean webhook events
- `GET /api/webhook/status` - Webhook status ve event history
- `GET /webhooks` - Webhook monitoring dashboard

### Webhook Configuration

#### GitHub Webhook Setup:
1. GitHub repository → Settings → Webhooks
2. Add webhook: `https://epica.com.tr/api/webhook`
3. Content type: `application/json`
4. Secret: Environment variable `GITHUB_WEBHOOK_SECRET`
5. Events: Push, Pull requests, Deployments

#### DigitalOcean Webhook Setup:
1. DigitalOcean App Platform → Settings → Webhooks
2. Add webhook: `https://epica.com.tr/api/webhook/digitalocean`
3. Events: Deployment started, completed, failed

### Database Schema

- **Users**: Kullanıcı bilgileri
- **Tasks**: Görev yönetimi
- **Projects**: Proje bilgileri

## Proje Yapısı

```
manager/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── users/
│   │   │   │   └── route.ts
│   │   │   └── tasks/
│   │   │       └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       └── prisma.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── .do/
│   └── app.yaml
├── package.json
├── next.config.js
└── tsconfig.json
```

## Teknolojiler

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **CSS3** - Modern styling
- **DigitalOcean App Platform** - Hosting ve deployment

## Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
