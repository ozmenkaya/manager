'use client'

import { useState, useEffect } from 'react'

interface DeploymentEvent {
  id: string
  type: string
  source: string
  timestamp: string
  status: 'success' | 'error' | 'processing'
  summary: string
  metadata?: any
}

export default function DeploymentStatus() {
  const [events, setEvents] = useState<DeploymentEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [lastDeploy, setLastDeploy] = useState<DeploymentEvent | null>(null)

  useEffect(() => {
    fetchDeploymentStatus()
    
    // Her 10 saniyede bir otomatik yenile (deployment sırasında)
    const interval = setInterval(fetchDeploymentStatus, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchDeploymentStatus = async () => {
    try {
      const response = await fetch('/api/webhook/status')
      if (response.ok) {
        const data = await response.json()
        const allEvents = data.events || []
        
        // Deployment ile ilgili eventleri filtrele
        const deploymentEvents = allEvents.filter((event: DeploymentEvent) => 
          event.type.includes('deployment') || 
          event.type.includes('build') || 
          event.type === 'push'
        )
        
        setEvents(deploymentEvents)
        
        // Son deployment'i bul
        const lastDeployEvent = deploymentEvents.find((event: DeploymentEvent) => 
          event.type === 'deployment_completed' || event.type === 'deployment_failed'
        )
        
        setLastDeploy(lastDeployEvent || null)
      }
    } catch (error) {
      console.error('Error fetching deployment status:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#10b981'
      case 'error': return '#ef4444'
      case 'processing': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (type: string, status: string) => {
    if (type === 'push') return '📝'
    if (type.includes('build')) {
      return status === 'success' ? '🔨✅' : status === 'error' ? '🔨❌' : '🔨⏳'
    }
    if (type.includes('deployment')) {
      return status === 'success' ? '🚀✅' : status === 'error' ? '🚀❌' : '🚀⏳'
    }
    return '📡'
  }

  const isDeploymentInProgress = () => {
    return events.some(event => 
      event.status === 'processing' && 
      (event.type.includes('deployment') || event.type.includes('build'))
    )
  }

  return (
    <div className="deployment-status">
      <div className="header">
        <h1>🚀 Deployment Status</h1>
        <p>GitHub → DigitalOcean Deployment Pipeline</p>
        
        <div className="current-status">
          {isDeploymentInProgress() ? (
            <div className="status-card processing">
              <div className="pulse-dot"></div>
              <h3>⚡ Deployment in Progress</h3>
              <p>Your changes are being deployed...</p>
            </div>
          ) : lastDeploy ? (
            <div className={`status-card ${lastDeploy.status}`}>
              <h3>
                {lastDeploy.status === 'success' ? '✅ Last Deployment: Success' : '❌ Last Deployment: Failed'}
              </h3>
              <p>{lastDeploy.summary}</p>
              <small>{new Date(lastDeploy.timestamp).toLocaleString('tr-TR')}</small>
            </div>
          ) : (
            <div className="status-card">
              <h3>📱 Ready for Deployment</h3>
              <p>Push to main branch to trigger deployment</p>
            </div>
          )}
        </div>
      </div>

      <div className="deployment-flow">
        <h2>📋 Deployment Flow</h2>
        <div className="flow-steps">
          <div className="step">
            <div className="step-icon">1️⃣</div>
            <h4>GitHub Push</h4>
            <p>Push code to main branch</p>
          </div>
          <div className="arrow">→</div>
          <div className="step">
            <div className="step-icon">2️⃣</div>
            <h4>Webhook Trigger</h4>
            <p>GitHub notifies DigitalOcean</p>
          </div>
          <div className="arrow">→</div>
          <div className="step">
            <div className="step-icon">3️⃣</div>
            <h4>Build Process</h4>
            <p>npm install & npm run build</p>
          </div>
          <div className="arrow">→</div>
          <div className="step">
            <div className="step-icon">4️⃣</div>
            <h4>Deploy</h4>
            <p>Live on epica.com.tr</p>
          </div>
        </div>
      </div>

      <div className="events-section">
        <div className="section-header">
          <h2>📊 Recent Deployment Events</h2>
          <button onClick={fetchDeploymentStatus} className="refresh-btn">
            🔄 Refresh
          </button>
        </div>
        
        {loading ? (
          <p>Loading deployment events...</p>
        ) : events.length > 0 ? (
          <div className="events-timeline">
            {events.slice(0, 10).map((event) => (
              <div key={event.id} className={`timeline-item ${event.status}`}>
                <div className="timeline-marker">
                  <span className="timeline-icon">
                    {getStatusIcon(event.type, event.status)}
                  </span>
                </div>
                <div className="timeline-content">
                  <div className="event-header">
                    <h4>{event.summary}</h4>
                    <span 
                      className="event-status"
                      style={{ color: getStatusColor(event.status) }}
                    >
                      {event.status}
                    </span>
                  </div>
                  <p className="event-details">
                    Type: {event.type} | Source: {event.source}
                  </p>
                  <small className="event-time">
                    {new Date(event.timestamp).toLocaleString('tr-TR')}
                  </small>
                  {event.metadata && (
                    <details className="event-metadata">
                      <summary>Details</summary>
                      <pre>{JSON.stringify(event.metadata, null, 2)}</pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-events">
            <p>No deployment events yet. Push to main branch to see deployment activity.</p>
          </div>
        )}
      </div>

      <div className="deployment-info">
        <h2>🔧 Configuration</h2>
        <div className="config-grid">
          <div className="config-item">
            <h4>Repository</h4>
            <p>github.com/ozmenkaya/manager</p>
          </div>
          <div className="config-item">
            <h4>Branch</h4>
            <p>main</p>
          </div>
          <div className="config-item">
            <h4>Auto Deploy</h4>
            <p>✅ Enabled</p>
          </div>
          <div className="config-item">
            <h4>Live URL</h4>
            <p><a href="https://epica.com.tr" target="_blank">epica.com.tr</a></p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .deployment-status {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        }

        .header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: #1f2937;
        }

        .header p {
          color: #6b7280;
          font-size: 1.1rem;
        }

        .current-status {
          margin: 2rem 0;
        }

        .status-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          position: relative;
        }

        .status-card.success {
          border-color: #10b981;
          background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
        }

        .status-card.error {
          border-color: #ef4444;
          background: linear-gradient(135deg, #fef2f2 0%, #fef2f2 100%);
        }

        .status-card.processing {
          border-color: #f59e0b;
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        }

        .pulse-dot {
          width: 12px;
          height: 12px;
          background: #f59e0b;
          border-radius: 50%;
          position: absolute;
          top: 1rem;
          right: 1rem;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }

        .deployment-flow {
          background: #f9fafb;
          border-radius: 12px;
          padding: 2rem;
          margin: 2rem 0;
        }

        .flow-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .step {
          text-align: center;
          flex: 1;
          min-width: 150px;
        }

        .step-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .step h4 {
          margin: 0.5rem 0;
          color: #1f2937;
        }

        .step p {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .arrow {
          font-size: 1.5rem;
          color: #9ca3af;
        }

        .events-section {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          margin: 2rem 0;
          overflow: hidden;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .section-header h2 {
          margin: 0;
          color: #1f2937;
        }

        .refresh-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .refresh-btn:hover {
          background: #2563eb;
        }

        .events-timeline {
          padding: 1.5rem;
        }

        .timeline-item {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          position: relative;
        }

        .timeline-item:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 1.5rem;
          top: 3rem;
          bottom: -1.5rem;
          width: 2px;
          background: #e5e7eb;
        }

        .timeline-marker {
          flex-shrink: 0;
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: white;
          border: 3px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
        }

        .timeline-item.success .timeline-marker {
          border-color: #10b981;
          background: #ecfdf5;
        }

        .timeline-item.error .timeline-marker {
          border-color: #ef4444;
          background: #fef2f2;
        }

        .timeline-item.processing .timeline-marker {
          border-color: #f59e0b;
          background: #fffbeb;
        }

        .timeline-content {
          flex: 1;
        }

        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }

        .event-header h4 {
          margin: 0;
          color: #1f2937;
        }

        .event-status {
          font-weight: 600;
          font-size: 0.8rem;
          text-transform: uppercase;
        }

        .event-details {
          color: #6b7280;
          font-size: 0.9rem;
          margin: 0.25rem 0;
        }

        .event-time {
          color: #9ca3af;
          font-size: 0.8rem;
        }

        .event-metadata {
          margin-top: 0.5rem;
        }

        .event-metadata summary {
          cursor: pointer;
          color: #3b82f6;
          font-size: 0.9rem;
        }

        .event-metadata pre {
          background: #f3f4f6;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          overflow-x: auto;
          margin-top: 0.5rem;
        }

        .deployment-info {
          background: #f9fafb;
          border-radius: 12px;
          padding: 2rem;
          margin: 2rem 0;
        }

        .config-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .config-item {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .config-item h4 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
        }

        .config-item p {
          margin: 0;
          color: #6b7280;
        }

        .config-item a {
          color: #3b82f6;
          text-decoration: none;
        }

        .config-item a:hover {
          text-decoration: underline;
        }

        .no-events {
          padding: 3rem;
          text-align: center;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .deployment-status {
            padding: 1rem;
          }
          
          .flow-steps {
            flex-direction: column;
          }
          
          .arrow {
            transform: rotate(90deg);
          }
          
          .event-header {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  )
}
