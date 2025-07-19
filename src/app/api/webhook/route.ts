import { NextRequest, NextResponse } from 'next/server'
import { verifyGitHubSignature, logWebhookEvent } from '@/lib/webhook-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-hub-signature-256')
    const event = request.headers.get('x-github-event')
    
    // GitHub webhook secret verification
    const secret = process.env.GITHUB_WEBHOOK_SECRET
    if (secret && signature) {
      if (!verifyGitHubSignature(body, signature, secret)) {
        await logWebhookEvent(
          'authentication',
          'github',
          'error',
          'Invalid webhook signature'
        )
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const payload = JSON.parse(body)
    
    // GitHub Events handling
    switch (event) {
      case 'push':
        return handlePushEvent(payload)
      case 'pull_request':
        return handlePullRequestEvent(payload)
      case 'deployment_status':
        return handleDeploymentEvent(payload)
      default:
        console.log(`Unhandled event: ${event}`)
        await logWebhookEvent(
          event || 'unknown',
          'github',
          'processing',
          `Unhandled GitHub event: ${event}`
        )
        return NextResponse.json({ message: 'Event received but not handled' })
    }
    
  } catch (error) {
    console.error('Webhook error:', error)
    await logWebhookEvent(
      'error',
      'github',
      'error',
      `Webhook processing failed: ${error}`
    )
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handlePushEvent(payload: any) {
  const { repository, ref, commits } = payload
  
  console.log(`Push to ${repository.full_name} on ${ref}`)
  console.log(`${commits.length} commits pushed`)
  
  // Push event işlemleri
  if (ref === 'refs/heads/main') {
    console.log('Deployment triggered for main branch')
    
    await logWebhookEvent(
      'push',
      'github',
      'success',
      `${commits.length} commits pushed to main branch`,
      { repository: repository.full_name, commits: commits.length }
    )
    
    // Burada deployment sonrası işlemler yapılabilir
    // Örnek: Database migration, cache temizleme, notification gönderme
  } else {
    await logWebhookEvent(
      'push',
      'github',
      'success',
      `${commits.length} commits pushed to ${ref}`,
      { repository: repository.full_name, branch: ref, commits: commits.length }
    )
  }
  
  return NextResponse.json({ 
    message: 'Push event processed',
    repository: repository.full_name,
    branch: ref,
    commits: commits.length
  })
}

async function handlePullRequestEvent(payload: any) {
  const { action, pull_request, repository } = payload
  
  console.log(`PR ${action}: ${pull_request.title} in ${repository.full_name}`)
  
  await logWebhookEvent(
    'pull_request',
    'github',
    'success',
    `PR ${action}: ${pull_request.title}`,
    { action, pr_number: pull_request.number, repository: repository.full_name }
  )
  
  return NextResponse.json({ 
    message: 'Pull request event processed',
    action,
    pr: pull_request.number,
    title: pull_request.title
  })
}

async function handleDeploymentEvent(payload: any) {
  const { deployment_status, repository } = payload
  
  console.log(`Deployment ${deployment_status.state} for ${repository.full_name}`)
  
  if (deployment_status.state === 'success') {
    console.log('🚀 Deployment successful!')
    
    await logWebhookEvent(
      'deployment_status',
      'github',
      'success',
      '🚀 Deployment completed successfully',
      { state: deployment_status.state, environment: deployment_status.environment }
    )
    
    // Deployment başarılı olduğunda yapılacak işlemler
    // Örnek: Slack notification, email gönderme, cache temizleme
  } else if (deployment_status.state === 'failure') {
    console.log('❌ Deployment failed!')
    
    await logWebhookEvent(
      'deployment_status',
      'github',
      'error',
      '❌ Deployment failed',
      { state: deployment_status.state, environment: deployment_status.environment }
    )
    
    // Deployment başarısız olduğunda yapılacak işlemler
    // Örnek: Error notification, rollback tetikleme
  } else {
    await logWebhookEvent(
      'deployment_status',
      'github',
      'processing',
      `Deployment ${deployment_status.state}`,
      { state: deployment_status.state, environment: deployment_status.environment }
    )
  }
  
  return NextResponse.json({ 
    message: 'Deployment event processed',
    state: deployment_status.state,
    environment: deployment_status.environment
  })
}

// GET method for webhook verification
export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook endpoint is active',
    timestamp: new Date().toISOString(),
    service: 'Epica Manager Webhooks'
  })
}
