from wsgiref.simple_server import make_server
from pyramid.config import Configurator
from pyramid.events import NewRequest
from pyramid.response import Response 
from database import Base, engine, DBSession
import transaction
import models # PENTING: Agar tabel dibuat otomatis

# --- 1. Fungsi Menambahkan Header CORS (Izin Akses) ---
def add_cors_headers_response_callback(event):
    def cors_headers(request, response):
        response.headers.update({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST,GET,DELETE,PUT,OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '1728000',
        })
    event.request.add_response_callback(cors_headers)

# --- 2. Fungsi Khusus Menangani Request OPTIONS ---
def handle_options_request(context, request):
    return Response() # Balas "OK" kosong saja agar browser senang

def main():
    # Buat tabel database otomatis (Berjalan karena ada import models di atas)
    Base.metadata.create_all(engine)

    with Configurator() as config:
        # Pasang CORS
        config.add_subscriber(add_cors_headers_response_callback, NewRequest)
        
        # Daftarkan Route
        config.add_route('analyze_review', '/api/analyze-review')
        config.add_route('get_reviews', '/api/reviews')
        
        # --- MENANGANI PREFLIGHT (OPTIONS) ---
        # Ini mencegah error 404 saat browser cek izin
        config.add_view(handle_options_request, route_name='analyze_review', request_method='OPTIONS')
        # -------------------------------------
        
        # Setup Database Session
        def add_db(request):
            return DBSession
        
        config.add_request_method(add_db, 'dbsession', reify=True)
        config.include('pyramid_tm')
        
        # Scan views.py untuk logika POST dan GET
        config.scan('views')
        
        app = config.make_wsgi_app()
    
    print("SERVER BERJALAN DI: http://localhost:6543")
    server = make_server('0.0.0.0', 6543, app)
    server.serve_forever()

if __name__ == '__main__':
    main()