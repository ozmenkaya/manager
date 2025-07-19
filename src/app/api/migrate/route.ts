import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    console.log('Starting database migration...')
    
    // Database bağlantısını test et
    await prisma.$connect()
    console.log('Database connection successful')
    
    // Prisma db push işlemini simüle edelim
    // Not: Production'da bu işlem dikkatli yapılmalı
    const result = await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "name" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "users_email_key" UNIQUE ("email")
      );
    `
    
    const result2 = await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "tasks" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "completed" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "userId" TEXT,
        CONSTRAINT "tasks_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
      );
    `
    
    const result3 = await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "projects" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "userId" TEXT,
        CONSTRAINT "projects_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
      );
    `
    
    console.log('Database tables created successfully')
    
    // Test data ekleme
    const existingUser = await prisma.user.findFirst()
    if (!existingUser) {
      const user = await prisma.user.create({
        data: {
          email: 'admin@epica.com.tr',
          name: 'Epica Admin'
        }
      })
      
      await prisma.task.create({
        data: {
          title: 'Database Kurulumu Tamamlandı',
          description: 'PostgreSQL database başarıyla konfigüre edildi',
          userId: user.id
        }
      })
      
      await prisma.project.create({
        data: {
          name: 'Epica Manager',
          description: 'Modern proje yönetim sistemi',
          userId: user.id
        }
      })
      
      console.log('Sample data created')
    }
    
    // Final test
    const userCount = await prisma.user.count()
    const taskCount = await prisma.task.count()
    const projectCount = await prisma.project.count()
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      status: 'success',
      message: 'Database migration completed successfully',
      data: {
        tablesCreated: true,
        userCount,
        taskCount,
        projectCount,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Migration error:', error)
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      status: 'error',
      message: 'Database migration failed',
      error: String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Database Migration Endpoint',
    instructions: 'POST request to start migration',
    warning: 'This will create database tables and sample data'
  })
}
