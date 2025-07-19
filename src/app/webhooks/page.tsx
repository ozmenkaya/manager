'use client'

import { useState, useEffect } from 'react'

interface WebhookEvent {
  id: string
  type: string
  source: string
  timestamp: string
  status: 'success' | 'error' | 'processing'
  summary: string
}

export default function WebhookDashboard() {
  const [events, setEvents] = useState<WebhookEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total_events: 0, status: 'unknown' })

  useEffect(() => {
    fetchWebhookStatus()
    
    // Her 30 saniyede bir otomatik yenile
    const interval = setInterval(fetchWebhookStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchWebhookStatus = async () => {
    try {
      const response = await fetch('/api/webhook/status')
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
        setStats({ 
          total_events: data.total_events || 0, 
          status: data.status || 'unknown' 
        })
      }
    } catch (error) {
      console.error('Error fetching webhook status:', error)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'processing': return '⏳'
      default: return '❓'
    }
  }

  return (
    <div className="webhook-dashboard">
      <div className="header">
        <h1>🔗 Webhook Dashboard</h1>
        <p>Epica Manager - Webhook Event Monitoring</p>
        
        <div className="stats">
          <div className="stat-card">
            <h3>Status</h3>
            <span className={`status ${stats.status}`}>
              {stats.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
            </span>
          </div>
          <div className="stat-card">
            <h3>Total Events</h3>
            <span className="count">{stats.total_events}</span>
          </div>
          <div className="stat-card">
            <h3>Recent Events</h3>
            <span className="count">{events.length}</span>
          </div>
        </div>
      </div>

      <div className="endpoints-info">
        <h2>📡 Webhook Endpoints</h2>
        <div className="endpoints">
          <div className="endpoint">
            <strong>GitHub:</strong>
            <code>https://epica.com.tr/api/webhook</code>
          </div>
          <div className="endpoint">
            <strong>DigitalOcean:</strong>
            <code>https://epica.com.tr/api/webhook/digitalocean</code>
          </div>
        </div>
      </div>

      <div className="events-section">
        <div className="section-header">
          <h2>📋 Recent Events</h2>
          <button onClick={fetchWebhookStatus} className="refresh-btn">
            🔄 Refresh
          </button>
        </div>
        
        {loading ? (
          <p>Loading events...</p>
        ) : events.length > 0 ? (
          <div className="events-list">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-header">
                  <span className="event-icon">
                    {getStatusIcon(event.status)}
                  </span>
                  <h4>{event.type}</h4>
                  <span className="event-source">{event.source}</span>
                  <span 
                    className="event-status"
                    style={{ color: getStatusColor(event.status) }}
                  >
                    {event.status}
                  </span>
                </div>
                <p className="event-summary">{event.summary}</p>
                <small className="event-time">
                  {new Date(event.timestamp).toLocaleString('tr-TR')}
                </small>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-events">
            <p>No webhook events yet. Events will appear here when webhooks are triggered.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .webhook-dashboard {
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

        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }

        .stat-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .stat-card h3 {
          margin: 0 0 0.5rem 0;
          color: #6b7280;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .status {
          font-weight: 600;
        }

        .status.active {
          color: #10b981;
        }

        .count {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
        }

        .endpoints-info {
          background: #f9fafb;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .endpoints-info h2 {
          margin-top: 0;
          color: #1f2937;
        }

        .endpoints {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .endpoint {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .endpoint code {
          background: #e5e7eb;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-family: 'SF Mono', Monaco, monospace;
          font-size: 0.9rem;
        }

        .events-section {
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
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

        .events-list {
          max-height: 600px;
          overflow-y: auto;
        }

        .event-card {
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .event-card:last-child {
          border-bottom: none;
        }

        .event-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .event-icon {
          font-size: 1.2rem;
        }

        .event-header h4 {
          margin: 0;
          flex: 1;
          color: #1f2937;
        }

        .event-source {
          background: #e5e7eb;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          color: #6b7280;
        }

        .event-status {
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
        }

        .event-summary {
          color: #4b5563;
          margin: 0.5rem 0;
        }

        .event-time {
          color: #9ca3af;
          font-size: 0.8rem;
        }

        .no-events {
          padding: 3rem;
          text-align: center;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .webhook-dashboard {
            padding: 1rem;
          }
          
          .endpoint {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .section-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  )
}
