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
    // Dashboard Besar
    <div className="dashboard-container">
      
      {/* --- KOLOM KIRI: SIDEBAR FORM --- */}
      <div className="sidebar">
        <div className="logo-area">
          <h1>ReviewAnalyzer AI</h1>
        </div>

        <form onSubmit={handleSubmit} className="form-wrapper">
          <div>
            <label className="input-label">Nama Produk</label>
            <input 
              className="styled-input"
              type="text" 
              placeholder="Contoh: iPhone 15 Pro" 
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="input-label">Ulasan Pengguna</label>
            <textarea 
              className="styled-input"
              placeholder="Paste review di sini..." 
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            />
          </div>

          <button className="btn-submit" disabled={loading}>
            {loading ? 'Sedang Menganalisa...' : '🚀 Analisa Sekarang'}
          </button>
        </form>
      </div>

      {/* --- KOLOM KANAN: HASIL UTAMA --- */}
      <div className="main-content">
        <div className="content-header">
          <h2>Riwayat Analisis</h2>
          <span style={{color: '#888', fontSize: '0.9rem'}}>Total: {reviews.length} Review</span>
        </div>

        {reviews.length === 0 ? (
          <div style={{
            textAlign: 'center', 
            marginTop: '100px', 
            color: '#aaa',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px'
          }}>
            <span style={{fontSize: '3rem'}}>📊</span>
            <p>Belum ada data. Silakan input di sebelah kiri.</p>
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
                  <span className="ai-label">✨ AI Key Points</span>
                  <ul>
                    {rev.key_points && rev.key_points.length > 0 ? (
                      rev.key_points.map((p, i) => <li key={i}>{p}</li>)
                    ) : (
                      <li>Tidak ada poin penting.</li>
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