import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'GitHub Webhook endpoint is ready!',
    url: 'https://epica.com.tr/api/webhook',
    status: 'active',
    timestamp: new Date().toISOString(),
    supported_events: [
      'push',
      'pull_request', 
      'deployment_status'
    ],
    setup_instructions: {
      step1: 'Go to GitHub repo → Settings → Webhooks',
      step2: 'Add webhook: https://epica.com.tr/api/webhook',
      step3: 'Content type: application/json',
      step4: 'Select events: Push, Pull requests, Deployments',
      step5: 'Add secret (optional but recommended)'
    }
  })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: 'This is the actual webhook endpoint. GitHub will POST here.',
    received_at: new Date().toISOString()
  })
}
