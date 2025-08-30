# Jeweller API

Node.js, TypeScript, Express ve Prisma ile geliştirilmiş RESTful web API projesi.

## Özellikler

- Kullanıcı kayıt ve giriş (authentication)
- JWT ile kimlik doğrulama
- PostgreSQL (Prisma ORM ile)
- Profesyonel dosya yapısı
- .env ile gizli anahtar yönetimi

## Kurulum

```bash
git clone https://github.com/GORKEMDEMIRKIRAN/Jeweller-api.git
cd Jeweller-api
npm install
```

## Ortam Değişkenleri

`.env` dosyanı aşağıdaki gibi oluştur:

```
DATABASE_URL=postgresql://kullanici:sifre@host:port/db
JWT_SECRET=senin_jwt_secretin
```

## Geliştirme

```bash
npm run build
npm start
```

## Seed (Test verisi ekleme)

```bash
npm run seed
```

## Komutlar

- `npm run build` – TypeScript derlemesi
- `npm start` – Derlenmiş uygulamayı başlatır
- `npm run dev` – Geliştirme modu (nodemon ile)
- `npm run seed` – Test verisi ekler

## Proje Yapısı

```
src/
  controllers/
  routes/
  services/
  middlewares/
  utils/
  config/
  app.ts
  server.ts
prisma/
  schema.prisma
.env.example
```

## Lisans

MIT


