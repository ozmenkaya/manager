'use client'

import { useState } from 'react'

export default function WebhookSetup() {
  const [copied, setCopied] = useState('')

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <div className="webhook-setup">
      <div className="header">
        <h1>🔗 GitHub Webhook Kurulum Rehberi</h1>
        <p>GitHub repository'nizi DigitalOcean ile otomatik deployment için bağlayın</p>
      </div>

      <div className="setup-steps">
        <div className="step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>GitHub Repository Settings</h3>
            <p>GitHub repository'nize gidin ve ayarlar sayfasını açın:</p>
            <div className="code-block">
              <code>https://github.com/ozmenkaya/manager/settings</code>
              <button 
                onClick={() => copyToClipboard('https://github.com/ozmenkaya/manager/settings', 'repo-url')}
                className="copy-btn"
              >
                {copied === 'repo-url' ? '✅' : '📋'}
              </button>
            </div>
          </div>
        </div>

        <div className="step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Webhooks Bölümü</h3>
            <p>Sol menüden <strong>Webhooks</strong> seçeneğini bulun ve <strong>Add webhook</strong> butonuna tıklayın.</p>
          </div>
        </div>

        <div className="step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3>Webhook URL</h3>
            <p>Payload URL alanına aşağıdaki URL'i girin:</p>
            <div className="code-block">
              <code>https://epica.com.tr/api/webhook</code>
              <button 
                onClick={() => copyToClipboard('https://epica.com.tr/api/webhook', 'webhook-url')}
                className="copy-btn"
              >
                {copied === 'webhook-url' ? '✅' : '📋'}
              </button>
            </div>
          </div>
        </div>

        <div className="step">
          <div className="step-number">4</div>
          <div className="step-content">
            <h3>Content Type</h3>
            <p>Content type olarak <strong>application/json</strong> seçin.</p>
          </div>
        </div>

        <div className="step">
          <div className="step-number">5</div>
          <div className="step-content">
            <h3>Secret (Opsiyonel)</h3>
            <p>Güvenlik için bir secret key ekleyin:</p>
            <div className="code-block">
              <code>{'I%];39A7y)3N-_qPK/m&mGl.]MXe[ZH4*v*^P5:Qfqlt&[)6{$mUgaUsDvowFU5'}</code>
              <button 
                onClick={() => copyToClipboard('I%];39A7y)3N-_qPK/m&mGl.]MXe[ZH4*v*^P5:Qfqlt&[)6{$mUgaUsDvowFU5', 'secret')}
                className="copy-btn"
              >
                {copied === 'secret' ? '✅' : '📋'}
              </button>
            </div>
            <small>Bu secret'ı DigitalOcean environment variables'a da eklemeniz gerekir: <strong>GITHUB_WEBHOOK_SECRET</strong></small>
          </div>
        </div>

        <div className="step">
          <div className="step-number">6</div>
          <div className="step-content">
            <h3>Events Seçimi</h3>
            <p>Hangi eventlerde webhook tetikleneceğini seçin:</p>
            <div className="events-list">
              <div className="event-item">
                <input type="checkbox" id="push" defaultChecked />
                <label htmlFor="push">
                  <strong>Push</strong> - Kod push edildiğinde (Ana özellik)
                </label>
              </div>
              <div className="event-item">
                <input type="checkbox" id="pr" defaultChecked />
                <label htmlFor="pr">
                  <strong>Pull requests</strong> - PR açıldığında/güncellendiğinde
                </label>
              </div>
              <div className="event-item">
                <input type="checkbox" id="deploy" defaultChecked />
                <label htmlFor="deploy">
                  <strong>Deployments</strong> - Deployment durumu değiştiğinde
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="step">
          <div className="step-number">7</div>
          <div className="step-content">
            <h3>Test & Kaydet</h3>
            <p><strong>Add webhook</strong> butonuna tıklayın ve webhook'u test edin.</p>
            <div className="test-section">
              <h4>Test URL:</h4>
              <div className="code-block">
                <code>https://epica.com.tr/api/webhook/test</code>
                <button 
                  onClick={() => copyToClipboard('https://epica.com.tr/api/webhook/test', 'test-url')}
                  className="copy-btn"
                >
                  {copied === 'test-url' ? '✅' : '📋'}
                </button>
              </div>
              <p>Bu URL'i tarayıcıda açarak endpoint'in çalışıp çalışmadığını kontrol edebilirsiniz.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="verification">
        <h2>✅ Doğrulama</h2>
        <p>Webhook kurulumunu doğrulamak için:</p>
        <ol>
          <li>GitHub'da webhook listesinde yeşil ✅ işareti görmelisiniz</li>
          <li>Küçük bir değişiklik yapıp main branch'e push edin</li>
          <li><a href="/deploy">Deployment Dashboard</a>'da aktiviteyi takip edin</li>
          <li><a href="/webhooks">Webhook Dashboard</a>'da event'leri görün</li>
        </ol>
      </div>

      <div className="troubleshooting">
        <h2>🔧 Sorun Giderme</h2>
        <div className="issue">
          <h4>❌ Webhook yanıt vermiyor</h4>
          <ul>
            <li>URL'in doğru olduğunu kontrol edin: <code>https://epica.com.tr/api/webhook</code></li>
            <li>Content type'ın <code>application/json</code> olduğunu kontrol edin</li>
            <li>SSL sertifikasının geçerli olduğunu kontrol edin</li>
          </ul>
        </div>
        
        <div className="issue">
          <h4>⚠️ Secret validation hatası</h4>
          <ul>
            <li>Secret'ın hem GitHub'da hem DigitalOcean environment variables'da aynı olduğunu kontrol edin</li>
            <li>Environment variable: <code>GITHUB_WEBHOOK_SECRET</code></li>
          </ul>
        </div>
      </div>

      <div className="next-steps">
        <h2>🚀 Sonraki Adımlar</h2>
        <p>Webhook kurulumu tamamlandıktan sonra:</p>
        <div className="next-grid">
          <a href="/deploy" className="next-card">
            <h4>📊 Deployment Takibi</h4>
            <p>Real-time deployment durumunu takip edin</p>
          </a>
          <a href="/webhooks" className="next-card">
            <h4>🔗 Webhook Events</h4>
            <p>Tüm webhook aktivitelerini görün</p>
          </a>
          <a href="/" className="next-card">
            <h4>🏠 Ana Sayfa</h4>
            <p>Epica Manager'a geri dönün</p>
          </a>
        </div>
      </div>

      <style jsx>{`
        .webhook-setup {
          max-width: 900px;
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

        .setup-steps {
          margin-bottom: 3rem;
        }

        .step {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .step-number {
          flex-shrink: 0;
          width: 3rem;
          height: 3rem;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.2rem;
        }

        .step-content {
          flex: 1;
        }

        .step-content h3 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
        }

        .step-content p {
          color: #4b5563;
          margin: 0.5rem 0;
        }

        .code-block {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f3f4f6;
          padding: 0.75rem;
          border-radius: 6px;
          margin: 0.5rem 0;
          border: 1px solid #d1d5db;
        }

        .code-block code {
          flex: 1;
          font-family: 'SF Mono', Monaco, monospace;
          color: #1f2937;
          font-size: 0.9rem;
        }

        .copy-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: background 0.2s;
        }

        .copy-btn:hover {
          background: #2563eb;
        }

        .events-list {
          margin-top: 1rem;
        }

        .event-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0.5rem 0;
        }

        .event-item input[type="checkbox"] {
          width: 1rem;
          height: 1rem;
        }

        .event-item label {
          color: #4b5563;
        }

        .test-section {
          background: #f0f9ff;
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
          border: 1px solid #0ea5e9;
        }

        .test-section h4 {
          margin: 0 0 0.5rem 0;
          color: #0c4a6e;
        }

        .verification, .troubleshooting, .next-steps {
          background: #f9fafb;
          padding: 2rem;
          border-radius: 12px;
          margin: 2rem 0;
        }

        .verification h2, .troubleshooting h2, .next-steps h2 {
          margin-top: 0;
          color: #1f2937;
        }

        .verification ol {
          color: #4b5563;
        }

        .verification a {
          color: #3b82f6;
          text-decoration: none;
        }

        .verification a:hover {
          text-decoration: underline;
        }

        .issue {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          margin: 1rem 0;
          border-left: 4px solid #f59e0b;
        }

        .issue h4 {
          margin: 0 0 0.5rem 0;
          color: #92400e;
        }

        .issue ul {
          color: #4b5563;
          margin: 0.5rem 0;
        }

        .next-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .next-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s;
        }

        .next-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .next-card h4 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
        }

        .next-card p {
          margin: 0;
          color: #6b7280;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .webhook-setup {
            padding: 1rem;
          }
          
          .step {
            flex-direction: column;
          }
          
          .code-block {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  )
}
