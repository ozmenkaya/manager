import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed users
  const user1 = await prisma.user.upsert({
    where: { email: 'admin@manager.com' },
    update: {},
    create: {
      email: 'admin@manager.com',
      name: 'Admin User',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'user@manager.com' },
    update: {},
    create: {
      email: 'user@manager.com',
      name: 'Regular User',
    },
  })

  // Seed tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Proje planlaması',
        description: 'Yeni projenin detaylı planlamasını yap',
        userId: user1.id,
      },
      {
        title: 'Database tasarımı',
        description: 'PostgreSQL veritabanı şemasını oluştur',
        userId: user1.id,
        completed: true,
      },
      {
        title: 'API geliştirme',
        description: 'REST API endpoint\'lerini geliştir',
        userId: user2.id,
      },
    ],
  })

  // Seed projects
  await prisma.project.createMany({
    data: [
      {
        name: 'Manager App',
        description: 'Modern yönetim uygulaması',
      },
      {
        name: 'E-commerce Platform',
        description: 'Online satış platformu',
      },
    ],
  })

  console.log('Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
