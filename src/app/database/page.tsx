'use client'

import { useState, useEffect } from 'react'

interface DbStatus {
  status: string
  message: string
  data?: {
    userCount: number
    taskCount: number
    databaseUrl: string
    timestamp: string
  }
  error?: string
  timestamp: string
}

export default function DatabaseStatus() {
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [migrating, setMigrating] = useState(false)

  const checkDbStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/db-test')
      const data = await response.json()
      setDbStatus(data)
    } catch (error) {
      setDbStatus({
        status: 'error',
        message: 'Failed to check database status',
        error: String(error),
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  const runMigration = async () => {
    setMigrating(true)
    try {
      const response = await fetch('/api/migrate', { method: 'POST' })
      const data = await response.json()
      
      if (response.ok) {
        alert('✅ Database migration tamamlandı! Tables oluşturuldu.')
        checkDbStatus() // Status'u yenile
      } else {
        alert('❌ Migration hatası: ' + data.message)
      }
    } catch (error) {
      alert('❌ Migration hatası: ' + String(error))
    } finally {
      setMigrating(false)
    }
  }

  useEffect(() => {
    checkDbStatus()
    // Her 30 saniyede bir kontrol et
    const interval = setInterval(checkDbStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return '#10b981'
      case 'error': return '#ef4444'
      default: return '#f59e0b'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return '✅'
      case 'error': return '❌'
      default: return '⚠️'
    }
  }

  return (
    <div className="db-status">
      <div className="header">
        <h1>🗄️ Database Status</h1>
        <p>PostgreSQL bağlantı durumu ve istatistikleri</p>
      </div>

      <div className="controls">
        <button 
          onClick={checkDbStatus}
          disabled={loading}
          className="refresh-btn"
        >
          {loading ? '🔄 Kontrol ediliyor...' : '🔄 Yeniden Kontrol Et'}
        </button>
        
        <button 
          onClick={runMigration}
          disabled={migrating || loading}
          className="migrate-btn"
        >
          {migrating ? '⚙️ Migration çalışıyor...' : '⚙️ Database Migration'}
        </button>
      </div>

      {dbStatus && (
        <div className="status-card">
          <div className="status-header">
            <span className="status-icon">
              {getStatusIcon(dbStatus.status)}
            </span>
            <div className="status-info">
              <h3 style={{ color: getStatusColor(dbStatus.status) }}>
                {dbStatus.status.toUpperCase()}
              </h3>
              <p>{dbStatus.message}</p>
            </div>
          </div>

          {dbStatus.data && (
            <div className="status-details">
              <h4>📊 Database İstatistikleri</h4>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">👤 Kullanıcılar:</span>
                  <span className="stat-value">{dbStatus.data.userCount}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">📋 Görevler:</span>
                  <span className="stat-value">{dbStatus.data.taskCount}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">🔗 Database URL:</span>
                  <span className="stat-value database-url">{dbStatus.data.databaseUrl}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">⏰ Son Kontrol:</span>
                  <span className="stat-value">{new Date(dbStatus.data.timestamp).toLocaleString('tr-TR')}</span>
                </div>
              </div>
            </div>
          )}

          {dbStatus.error && (
            <div className="error-details">
              <h4>❌ Hata Detayları</h4>
              <pre>{dbStatus.error}</pre>
            </div>
          )}
        </div>
      )}

      <div className="actions">
        <h3>🔧 Database İşlemleri</h3>
        <div className="action-grid">
          <a href="/api/users" className="action-card" target="_blank">
            <h4>👤 Users API</h4>
            <p>Kullanıcı listesini görüntüle</p>
          </a>
          <a href="/api/tasks" className="action-card" target="_blank">
            <h4>📋 Tasks API</h4>
            <p>Görev listesini görüntüle</p>
          </a>
          <a href="/api/db-test" className="action-card" target="_blank">
            <h4>🧪 DB Test API</h4>
            <p>Raw database test sonucu</p>
          </a>
          <a href="/" className="action-card">
            <h4>🏠 Ana Sayfa</h4>
            <p>Manager uygulamasına dön</p>
          </a>
        </div>
      </div>

      <style jsx>{`
        .db-status {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
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

        .controls {
          text-align: center;
          margin-bottom: 2rem;
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .refresh-btn, .migrate-btn {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .migrate-btn {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .refresh-btn:hover:not(:disabled), .migrate-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .migrate-btn:hover:not(:disabled) {
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .refresh-btn:disabled, .migrate-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .status-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .status-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .status-icon {
          font-size: 2rem;
        }

        .status-info h3 {
          margin: 0 0 0.25rem 0;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .status-info p {
          margin: 0;
          color: #6b7280;
        }

        .status-details h4 {
          margin: 0 0 1rem 0;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .stat-label {
          font-weight: 500;
          color: #4b5563;
        }

        .stat-value {
          font-weight: 600;
          color: #1f2937;
        }

        .database-url {
          font-family: 'SF Mono', Monaco, monospace;
          font-size: 0.875rem;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .error-details {
          margin-top: 1.5rem;
          padding: 1rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
        }

        .error-details h4 {
          margin: 0 0 0.5rem 0;
          color: #dc2626;
        }

        .error-details pre {
          margin: 0;
          background: #fee2e2;
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 0.875rem;
          overflow-x: auto;
          color: #991b1b;
        }

        .actions {
          background: #f9fafb;
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .actions h3 {
          margin-top: 0;
          color: #1f2937;
        }

        .action-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .action-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s;
        }

        .action-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: #3b82f6;
        }

        .action-card h4 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
          font-size: 1.1rem;
        }

        .action-card p {
          margin: 0;
          color: #6b7280;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .db-status {
            padding: 1rem;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .action-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
