from flask import Flask, request, jsonify, abort
from flask_cors import CORS
from pymongo import MongoClient
from flask_swagger_ui import get_swaggerui_blueprint
import os
from dotenv import load_dotenv

from src.routes.users import users_route
from src.routes.api_key import api_key
from src.routes.devices import devices_routes
from src.routes.plants import plants_routes
from src.services.s3_bucket import bucket_route
from src.routes.api_growth import api_growatt_bp
from src.routes.mercadopago import mercadopago_route

load_dotenv()

application = Flask(__name__)
CORS(application)

application.config['MERCADOPAGO_PUBLIC_KEY'] = os.getenv('MERCADOPAGO_PUBLIC_KEY')
application.config['MERCADOPAGO_ACCESS_TOKEN'] = os.getenv('MERCADOPAGO_ACCESS_TOKEN')

# Configuración de Swagger
SWAGGER_URL = "/docs"
API_URL = "/static/swagger.json"
SWAGGER_BLUEPRINT = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={"app_name": "Gaia API"}
)

application.register_blueprint(SWAGGER_BLUEPRINT, url_prefix=SWAGGER_URL)
application.register_blueprint(api_key, url_prefix='/api_key')
application.register_blueprint(users_route, url_prefix='/users')
application.register_blueprint(devices_routes, url_prefix='/devices')
application.register_blueprint(plants_routes, url_prefix='/plants')
application.register_blueprint(bucket_route, url_prefix='/upload_image')
application.register_blueprint(api_growatt_bp, url_prefix='/api_growatt')
application.register_blueprint(mercadopago_route, url_prefix='/mercadopago')

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri, tlsAllowInvalidCertificates=True)
db = client['gaia']
collection = db['users']

def validar_api_key():
    # Asegúrate de que las rutas exentas incluyan tanto '/docs' como cualquier ruta subyacente
    rutas_sin_validacion = ['/', '/api_key/generate/<user_id>']  # Añade otras rutas según sea necesario
    if request.path == '/docs' or request.path.startswith('/docs/') or request.path in rutas_sin_validacion or request.method == 'OPTIONS':
        return  # No validar la API Key para estas rutas
    
    api_key = request.headers.get('X-API-KEY')
    if not api_key:
        abort(401, description='API Key ausente.')
    
    user = db.users.find_one({"api_key": api_key})
    if not user:
        abort(401, description='API Key inválida.')

@application.before_request
def before_request_func():
    validar_api_key()

@application.route('/', methods=['GET'])
def welcome():
    return jsonify({'message': 'Welcome to the Gaia Server!'})

if __name__ == '__main__':
    try:
        application.run(debug=True)
    finally:
        # No es necesario cerrar explícitamente el cliente de MongoDB aquí
        # client.close()
        pass
