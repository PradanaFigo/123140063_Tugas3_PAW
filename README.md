# ⚡ Review.AI - Premium Product Analytics Dashboard

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Python](https://img.shields.io/badge/Backend-Pyramid-blue)
![React](https://img.shields.io/badge/Frontend-React_Vite-61DAFB)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791)

Aplikasi analisis ulasan produk berbasis web modern yang menggunakan **Artificial Intelligence**. Aplikasi ini dapat membaca teks ulasan, menentukan sentimen (Positif/Negatif/Netral) menggunakan **Hugging Face**, dan mengekstrak poin-poin penting menggunakan **Google Gemini AI**.

Dibalut dengan antarmuka **Dark Mode Premium (Glassmorphism)** untuk pengalaman pengguna yang profesional.

---

## ✨ Fitur Utama

* **🛡️ AI Sentiment Analysis:** Otomatis mendeteksi apakah ulasan bersifat positif, negatif, atau netral.
* **🧠 Key Point Extraction:** Menggunakan Google Gemini untuk merangkum poin penting dari ulasan panjang.
* **💎 Premium Dark UI:** Tampilan dashboard modern dengan efek kaca (glassmorphism) dan animasi halus.
* **💾 Database History:** Menyimpan semua hasil analisis ke PostgreSQL secara otomatis.
* **⚡ Real-time Analysis:** Proses cepat dengan loading state yang interaktif.

---

## 🛠️ Tech Stack

### Backend
* **Framework:** Python Pyramid
* **ORM:** SQLAlchemy
* **Database:** PostgreSQL
* **Libraries:** `requests` (API Call), `google-generativeai` (Gemini), `pyramid_tm` (Transaction)

### Frontend
* **Framework:** React JS (Vite)
* **Styling:** Custom CSS (Dark Theme, Glassmorphism, Responsive Grid)
* **HTTP Client:** Axios

### AI Services
* **Hugging Face Inference API** (Sentiment)
* **Google Generative AI** (Key Points)

---

## 🚀 Cara Instalasi & Menjalankan

Ikuti langkah-langkah ini secara berurutan.

### 1. Persiapan Database (PostgreSQL)
Pastikan PostgreSQL sudah terinstall. Buat database baru melalui pgAdmin atau Terminal:

```sql
CREATE DATABASE review_db;
Catatan: Aplikasi ini dikonfigurasi menggunakan password: figo12342. Setup Backend (Server)Buka terminal, masuk ke folder Backend:Bashcd Backend
Buat virtual environment & install dependencies:Bashpython -m venv venv
# Aktifkan venv (Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate)

pip install pyramid pyramid_tm sqlalchemy psycopg2 zope.sqlalchemy requests google-generativeai waitress transaction
Jalankan Server:Bashpython app.py
✅ Server akan berjalan di: http://localhost:65433. Setup Frontend (Client)Buka terminal baru, masuk ke folder Frontend:Bashcd Frontend
Install library & jalankan aplikasi:Bashnpm install
npm run dev
✅ Akses aplikasi di: http://localhost:5173⚙️

🔌 API DocumentationBackend menyediakan 3 endpoint utama:MethodEndpointDeskripsiPOST/api/analyze-reviewKirim data {product_name, review_text} untuk dianalisis AI.GET/api/reviewsAmbil semua riwayat review dari database.OPTIONS/api/analyze-reviewCek izin akses (CORS).
