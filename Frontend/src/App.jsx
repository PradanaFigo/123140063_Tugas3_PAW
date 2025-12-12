import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [productName, setProductName] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [loading, setLoading] = useState(false)
  const [reviews, setReviews] = useState([])

  const API_URL = 'http://localhost:6543/api'

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_URL}/reviews`)
      setReviews(res.data)
    } catch (error) {
      console.log("Error koneksi backend")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(`${API_URL}/analyze-review`, {
        product_name: productName,
        review_text: reviewText
      })
      setProductName('')
      setReviewText('')
      fetchReviews()
    } catch (error) {
      alert("Gagal menganalisa. Backend mati?")
    }
    setLoading(false)
  }

  const getBadgeClass = (sentiment) => {
    if (!sentiment) return 'badge-neu'
    const s = sentiment.toUpperCase()
    if (s.includes('POSITIVE')) return 'badge-pos'
    if (s.includes('NEGATIVE')) return 'badge-neg'
    return 'badge-neu'
  }

  return (
    // Dashboard Besar Dark Mode
    <div className="dashboard-container">
      
      {/* --- KOLOM KIRI: SIDEBAR FORM --- */}
      <div className="sidebar">
        <div className="logo-area">
          <h1>⚡ Review.AI</h1>
          <p style={{color: '#64748b', fontSize: '0.8rem', marginTop: '5px'}}>Premium Analytics Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="form-wrapper">
          <div>
            <label className="input-label">Product Name</label>
            <input 
              className="styled-input"
              type="text" 
              placeholder="e.g. RTX 4090 Gaming OC" 
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="input-label">User Review</label>
            <textarea 
              className="styled-input"
              placeholder="Paste raw text analysis here..." 
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            />
          </div>

          <button className="btn-submit" disabled={loading}>
            {loading ? 'PROCESSING...' : 'INITIALIZE ANALYSIS'}
          </button>
        </form>
      </div>

      {/* --- KOLOM KANAN: HASIL UTAMA --- */}
      <div className="main-content">
        <div className="content-header">
          <div>
            <h2>Analysis Logs</h2>
            <span style={{color: '#64748b', fontSize: '0.9rem', display: 'block', marginTop: '5px'}}>
              Real-time Sentiment Processing
            </span>
          </div>
          <div style={{background: '#1e293b', padding: '10px 20px', borderRadius: '8px', border: '1px solid #334155'}}>
            <span style={{color: '#94a3b8', fontSize: '0.85rem'}}>TOTAL SCANS: </span>
            <strong style={{color: 'white', fontSize: '1.2rem'}}>{reviews.length}</strong>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div style={{
            textAlign: 'center', 
            marginTop: '150px', 
            color: '#475569',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{fontSize: '4rem', opacity: 0.5}}>📡</div>
            <p style={{fontSize: '1.1rem', fontWeight: 500}}>No Data Stream Detected</p>
            <p style={{fontSize: '0.9rem'}}>Initiate a new scan from the control panel.</p>
          </div>
        ) : (
          <div className="review-grid">
            {reviews.map((rev) => (
              <div key={rev.id} className="result-card">
                
                <div className="card-top">
                  <h3>{rev.product_name}</h3>
                  <span className={`badge ${getBadgeClass(rev.sentiment)}`}>
                    {rev.sentiment || 'N/A'}
                  </span>
                </div>

                <p className="review-body">"{rev.review_text}"</p>

                <div className="ai-insights">
                  <span className="ai-label">🤖 INTELLIGENCE EXTRACTION</span>
                  <ul>
                    {rev.key_points && rev.key_points.length > 0 ? (
                      rev.key_points.map((p, i) => <li key={i}>{p}</li>)
                    ) : (
                      <li>No key vectors identified.</li>
                    )}
                  </ul>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default App