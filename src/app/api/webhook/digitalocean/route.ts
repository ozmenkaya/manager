import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const event = request.headers.get('x-digitalocean-event')
    
    console.log('DigitalOcean webhook received:', event)
    console.log('Payload:', body)
    
    switch (event) {
      case 'app.deployment.completed':
        return handleDeploymentCompleted(body)
      case 'app.deployment.failed':
        return handleDeploymentFailed(body)
      case 'app.deployment.started':
        return handleDeploymentStarted(body)
      default:
        console.log(`Unhandled DigitalOcean event: ${event}`)
        return NextResponse.json({ message: 'Event received but not handled' })
    }
    
  } catch (error) {
    console.error('DigitalOcean webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleDeploymentStarted(payload: any) {
  console.log('🚀 Deployment started on DigitalOcean')
  
  // Deployment başladığında yapılacak işlemler
  // Örnek: Status update, notification
  
  return NextResponse.json({ 
    message: 'Deployment started notification processed',
    app_id: payload.app?.id,
    timestamp: new Date().toISOString()
  })
}

async function handleDeploymentCompleted(payload: any) {
  console.log('✅ Deployment completed successfully!')
  
  // Deployment tamamlandığında yapılacak işlemler
  // Örnek: Cache warming, post-deployment tasks
  
  return NextResponse.json({ 
    message: 'Deployment completed notification processed',
    app_id: payload.app?.id,
    live_url: payload.app?.live_url,
    timestamp: new Date().toISOString()
  })
}

async function handleDeploymentFailed(payload: any) {
  console.log('❌ Deployment failed!')
  console.error('Deployment error:', payload.deployment?.error)
  
  // Deployment başarısız olduğunda yapılacak işlemler
  // Örnek: Error notification, alert gönderme
  
  return NextResponse.json({ 
    message: 'Deployment failed notification processed',
    app_id: payload.app?.id,
    error: payload.deployment?.error,
    timestamp: new Date().toISOString()
  })
}

// GET method for webhook verification
export async function GET() {
  return NextResponse.json({ 
    message: 'DigitalOcean webhook endpoint is active',
    timestamp: new Date().toISOString(),
    service: 'Epica Manager - DigitalOcean Webhooks'
  })
}
