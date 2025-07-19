# Manager App

Modern yönetim uygulaması - DigitalOcean App Platform ile otomatik deployment

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

### DigitalOcean App Platform Kurulumu

1. DigitalOcean hesabınıza giriş yapın
2. App Platform'u seçin  
3. GitHub repository'nizi bağlayın
4. Uygulama otomatik olarak `.do/app.yaml` dosyasını algılayacak
5. PostgreSQL database otomatik olarak oluşturulup bağlanacak
6. Environment variables otomatik set edilecek:
   - `DATABASE_URL` - PostgreSQL bağlantı URL'i
7. Build ve deploy otomatik başlayacak

### API Endpoints

- `GET /api/users` - Tüm kullanıcıları listele
- `POST /api/users` - Yeni kullanıcı oluştur
- `GET /api/tasks` - Tüm görevleri listele  
- `POST /api/tasks` - Yeni görev oluştur

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
