// Event logging helper function
export async function logWebhookEvent(
  type: string,
  source: string,
  status: 'success' | 'error' | 'processing',
  summary: string,
  metadata?: any
) {
  try {
    await fetch('/api/webhook/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, source, status, summary, metadata })
    })
  } catch (error) {
    console.error('Failed to log webhook event:', error)
  }
}

// Webhook signature verification helper
export function verifyGitHubSignature(body: string, signature: string, secret: string): boolean {
  const crypto = require('crypto')
  const expectedSignature = `sha256=${crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')}`
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

// Webhook event types
export type WebhookEventType = 
  | 'push'
  | 'pull_request' 
  | 'deployment_status'
  | 'app.deployment.started'
  | 'app.deployment.completed'
  | 'app.deployment.failed'

export type WebhookStatus = 'success' | 'error' | 'processing'

export interface WebhookEvent {
  id: string
  type: WebhookEventType
  source: 'github' | 'digitalocean'
  status: WebhookStatus
  summary: string
  metadata?: any
  timestamp: string
}
