import { NextRequest, NextResponse } from 'next/server'

// In-memory store for webhook events (production'da Redis/Database kullanın)
let webhookEvents: any[] = []

export async function GET() {
  try {
    // Son 50 webhook event'ini döndür
    const recentEvents = webhookEvents
      .slice(-50)
      .reverse()
      .map(event => ({
        id: event.id,
        type: event.type,
        source: event.source,
        timestamp: event.timestamp,
        status: event.status,
        summary: event.summary
      }))
    
    return NextResponse.json({
      events: recentEvents,
      total_events: webhookEvents.length,
      status: 'active',
      endpoints: {
        github: '/api/webhook',
        digitalocean: '/api/webhook/digitalocean'
      }
    })
    
  } catch (error) {
    console.error('Webhook status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, source, status, summary, metadata } = body
    
    // Yeni webhook event'i kaydet
    const event = {
      id: Date.now().toString(),
      type,
      source,
      status,
      summary,
      metadata,
      timestamp: new Date().toISOString()
    }
    
    webhookEvents.push(event)
    
    // Memory'de sadece son 1000 event'i tut
    if (webhookEvents.length > 1000) {
      webhookEvents = webhookEvents.slice(-1000)
    }
    
    return NextResponse.json({ 
      message: 'Event logged',
      event_id: event.id
    })
    
  } catch (error) {
    console.error('Webhook logging error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
