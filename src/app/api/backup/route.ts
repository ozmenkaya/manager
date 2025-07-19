import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    await prisma.$connect()
    
    // Tüm verileri export et
    const users = await prisma.user.findMany({
      include: {
        tasks: true,
        projects: true
      }
    })
    
    const tasks = await prisma.task.findMany({
      include: {
        user: true
      }
    })
    
    const projects = await prisma.project.findMany({
      include: {
        user: true
      }
    })
    
    await prisma.$disconnect()
    
    const backup = {
      timestamp: new Date().toISOString(),
      version: 'v1.0.0-stable',
      database: 'epica_manager_production',
      data: {
        users,
        tasks, 
        projects
      },
      stats: {
        userCount: users.length,
        taskCount: tasks.length,
        projectCount: projects.length
      }
    }
    
    return NextResponse.json(backup)
    
  } catch (error) {
    await prisma.$disconnect()
    
    return NextResponse.json({
      error: 'Backup failed',
      message: String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
