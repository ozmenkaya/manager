'use client'

import { useState, useEffect } from 'react'

interface Task {
  id: string
  title: string
  description: string | null
  completed: boolean
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string
  }
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">
      <div className="hero">
        <h1>Epica Manager</h1>
        <p>Modern yönetim sisteminize hoş geldiniz! | epica.com.tr</p>
        
        <div className="features">
          <div className="feature">
            <h3>🚀 Hızlı</h3>
            <p>Next.js ile optimize edilmiş performans</p>
          </div>
          <div className="feature">
            <h3>📊 Database</h3>
            <p>PostgreSQL ile güvenli veri yönetimi</p>
          </div>
          <div className="feature">
            <h3>⚡ Otomatik Deploy</h3>
            <p>DigitalOcean App Platform entegrasyonu</p>
          </div>
        </div>

        <div className="tasks-section">
          <h2>Güncel Görevler</h2>
          {loading ? (
            <p>Görevler yükleniyor...</p>
          ) : tasks.length > 0 ? (
            <div className="tasks-grid">
              {tasks.slice(0, 3).map((task) => (
                <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  <small>Atanan: {task.user.name || task.user.email}</small>
                  <span className={`status ${task.completed ? 'done' : 'pending'}`}>
                    {task.completed ? '✅ Tamamlandı' : '⏳ Bekliyor'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>Henüz görev bulunmuyor. Database bağlantısını kontrol edin.</p>
          )}
        </div>
      </div>
    </main>
  )
}
