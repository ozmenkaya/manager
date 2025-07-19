import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const event = request.headers.get('x-digitalocean-event') || 
                  request.headers.get('x-event-type') || 
                  body.type

    console.log('DigitalOcean webhook received:', event)
    console.log('Payload:', body)
    
    switch (event) {
      case 'app.deployment.completed':
      case 'deployment.completed':
        return handleDeploymentCompleted(body)
      case 'app.deployment.failed':
      case 'deployment.failed':
        return handleDeploymentFailed(body)
      case 'app.deployment.started':
      case 'deployment.started':
        return handleDeploymentStarted(body)
      case 'app.build.completed':
        return handleBuildCompleted(body)
      case 'app.build.failed':
        return handleBuildFailed(body)
      default:
        console.log(`Unhandled DigitalOcean event: ${event}`)
        
        // Log unknown events
        await logEvent(
          'unknown',
          'digitalocean',
          'processing',
          `Unknown event received: ${event}`,
          { event, body }
        )
        
        return NextResponse.json({ message: 'Event received but not handled' })
    }
    
  } catch (error) {
    console.error('DigitalOcean webhook error:', error)
    
    await logEvent(
      'error',
      'digitalocean',
      'error',
      `Webhook processing failed: ${error}`,
      { error: String(error) }
    )
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleDeploymentStarted(payload: any) {
  console.log('🚀 DigitalOcean deployment started')
  
  await logEvent(
    'deployment_started',
    'digitalocean',
    'processing',
    '🚀 DigitalOcean deployment started',
    { 
      app_id: payload.app?.id || payload.app_id,
      deployment_id: payload.deployment?.id || payload.deployment_id,
      timestamp: new Date().toISOString()
    }
  )
  
  return NextResponse.json({ 
    message: 'Deployment started notification processed',
    app_id: payload.app?.id || payload.app_id,
    timestamp: new Date().toISOString()
  })
}

async function handleBuildCompleted(payload: any) {
  console.log('🔨 Build completed successfully')
  
  await logEvent(
    'build_completed',
    'digitalocean',
    'success',
    '🔨 Build completed - starting deployment',
    { 
      app_id: payload.app?.id || payload.app_id,
      build_id: payload.build?.id || payload.build_id
    }
  )
  
  return NextResponse.json({ 
    message: 'Build completed notification processed',
    app_id: payload.app?.id || payload.app_id
  })
}

async function handleBuildFailed(payload: any) {
  console.log('❌ Build failed!')
  
  await logEvent(
    'build_failed',
    'digitalocean',
    'error',
    '❌ Build failed - deployment stopped',
    { 
      app_id: payload.app?.id || payload.app_id,
      build_id: payload.build?.id || payload.build_id,
      error: payload.build?.error || 'Build failed'
    }
  )
  
  return NextResponse.json({ 
    message: 'Build failed notification processed',
    app_id: payload.app?.id || payload.app_id,
    error: payload.build?.error
  })
}

async function handleDeploymentCompleted(payload: any) {
  console.log('✅ DigitalOcean deployment completed successfully!')
  
  const liveUrl = payload.app?.live_url || payload.live_url || 'https://epica.com.tr'
  
  await logEvent(
    'deployment_completed',
    'digitalocean',
    'success',
    `✅ Deployment completed! Live at: ${liveUrl}`,
    { 
      app_id: payload.app?.id || payload.app_id,
      live_url: liveUrl,
      deployment_id: payload.deployment?.id || payload.deployment_id,
      completed_at: new Date().toISOString()
    }
  )
  
  // Post-deployment tasks
  try {
    console.log('🔄 Running post-deployment tasks...')
    
    // Cache warming, database migrations vs. burada yapılabilir
    await logEvent(
      'post_deployment',
      'digitalocean',
      'success',
      '🔄 Post-deployment tasks completed',
      { app_id: payload.app?.id || payload.app_id }
    )
    
  } catch (error) {
    console.error('Post-deployment task error:', error)
    
    await logEvent(
      'post_deployment',
      'digitalocean',
      'error',
      '❌ Post-deployment tasks failed',
      { error: String(error) }
    )
  }
  
  return NextResponse.json({ 
    message: 'Deployment completed notification processed',
    app_id: payload.app?.id || payload.app_id,
    live_url: liveUrl,
    timestamp: new Date().toISOString()
  })
}

async function handleDeploymentFailed(payload: any) {
  console.log('❌ DigitalOcean deployment failed!')
  console.error('Deployment error:', payload.deployment?.error || payload.error)
  
  await logEvent(
    'deployment_failed',
    'digitalocean',
    'error',
    '❌ Deployment failed!',
    { 
      app_id: payload.app?.id || payload.app_id,
      deployment_id: payload.deployment?.id || payload.deployment_id,
      error: payload.deployment?.error || payload.error || 'Deployment failed',
      failed_at: new Date().toISOString()
    }
  )
  
  return NextResponse.json({ 
    message: 'Deployment failed notification processed',
    app_id: payload.app?.id || payload.app_id,
    error: payload.deployment?.error || payload.error,
    timestamp: new Date().toISOString()
  })
}

// Event logging helper
async function logEvent(
  type: string,
  source: string,
  status: 'success' | 'error' | 'processing',
  summary: string,
  metadata?: any
) {
  try {
    const response = await fetch(`${process.env.APP_URL || 'http://localhost:3000'}/api/webhook/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, source, status, summary, metadata })
    })
    
    if (!response.ok) {
      console.error('Failed to log webhook event:', response.statusText)
    }
  } catch (error) {
    console.error('Failed to log webhook event:', error)
  }
}

// GET method for webhook verification
export async function GET() {
  return NextResponse.json({ 
    message: 'DigitalOcean webhook endpoint is active',
    timestamp: new Date().toISOString(),
    service: 'Epica Manager - DigitalOcean Webhooks',
    supported_events: [
      'app.deployment.started',
      'app.deployment.completed', 
      'app.deployment.failed',
      'app.build.completed',
      'app.build.failed'
    ]
  })
}
