from pyramid.view import view_config
import requests
import google.generativeai as genai
import json
import time
from models import Review
from database import DBSession

# --- AREA API KEY ---
# Biarkan kosong jika ingin pakai mode Mock/Dummy
HF_TOKEN = "" 
GEMINI_API_KEY = ""
# --------------------

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

HF_API_URL = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english"

def call_huggingface_sentiment(text):
    # Jika Key Kosong, gunakan Data Palsu (Mock)
    if not HF_TOKEN:
        print("INFO: Menggunakan Mock Sentiment (Tanpa API Key)")
        time.sleep(1) # Pura-pura loading
        return {'label': 'POSITIVE (MOCK)', 'score': 0.95}

    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    try:
        response = requests.post(HF_API_URL, headers=headers, json={"inputs": text})
        data = response.json()
        if isinstance(data, list) and len(data) > 0:
            best = max(data[0], key=lambda x: x['score'])
            return {'label': best['label'], 'score': best['score']}
        return {'label': 'NEUTRAL', 'score': 0.5}
    except Exception as e:
        print(f"Error HF: {e}")
        return {'label': 'ERROR', 'score': 0.0}

def extract_key_points_gemini(text):
    # Jika Key Kosong, gunakan Data Palsu (Mock)
    if not GEMINI_API_KEY:
        print("INFO: Menggunakan Mock Gemini (Tanpa API Key)")
        return ["Harga terjangkau (Mock)", "Kualitas bagus (Mock)", "Pengiriman cepat (Mock)"]

    try:
        model = genai.GenerativeModel('gemini-pro')
        prompt = f"Extract 3 short key points from this review. Return ONLY a JSON list of strings. Review: '{text}'"
        response = model.generate_content(prompt)
        clean_text = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(clean_text)
    except Exception as e:
        print(f"Error Gemini: {e}")
        return ["Gagal mengekstrak poin"]

@view_config(route_name='analyze_review', request_method='POST', renderer='json')
def analyze_review(request):
    try:
        data = request.json_body
        product_name = data.get('product_name')
        review_text = data.get('review_text')

        # 1. Panggil Fungsi AI
        sentiment_res = call_huggingface_sentiment(review_text)
        key_points = extract_key_points_gemini(review_text)

        # 2. Simpan ke Database
        review = Review(
            product_name=product_name,
            review_text=review_text,
            sentiment=sentiment_res['label'],
            confidence=sentiment_res['score'],
            key_points=json.dumps(key_points)
        )
        DBSession.add(review)
        
        return {
            'status': 'success',
            'sentiment': sentiment_res['label'],
            'key_points': key_points
        }
    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}

@view_config(route_name='get_reviews', request_method='GET', renderer='json')
def get_reviews(request):
    reviews = DBSession.query(Review).order_by(Review.created_at.desc()).all()
    result = []
    for r in reviews:
        try:
            points = json.loads(r.key_points)
        except:
            points = []
        
        result.append({
            'id': r.id,
            'product_name': r.product_name,
            'sentiment': r.sentiment,
            'key_points': points
        })
    return result