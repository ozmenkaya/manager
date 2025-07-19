import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Database bağlantısını test et
    await prisma.$connect()
    
    // Basit bir query ile test
    const userCount = await prisma.user.count()
    const taskCount = await prisma.task.count()
    
    // Connection bilgilerini al
    const dbUrl = process.env.DATABASE_URL
    const maskedUrl = dbUrl ? dbUrl.replace(/:[^:@]*@/, ':***@') : 'Not configured'
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      status: 'connected',
      message: 'Database connection successful',
      data: {
        userCount,
        taskCount,
        databaseUrl: maskedUrl,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Database connection error:', error)
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
