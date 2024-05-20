from flask import Flask, request, jsonify, abort
from flask_cors import CORS
from pymongo import MongoClient
from flask_swagger_ui import get_swaggerui_blueprint
import os
from dotenv import load_dotenv
import secrets

from src.routes.users import users_route
# from src.routes.api_key import api_key
from src.routes.devices import devices_routes
from src.routes.plants import plants_routes
from src.services.s3_bucket import bucket_route
from src.routes.api_growth import api_growatt_bp
from src.routes.mercadopago import mercadopago_route
from src.routes.face import face_route
from src.routes.coinbase import coinbase_route
from src.routes.sms import sms_route
from src.routes.paypal import paypal_route
from src.routes.authenticator import auth_route
from src.routes.payments_users import payments_users_route
from src.routes.chatbox import chatbox_route
from src.routes.wallet_gaia import wallet_route
from src.routes.transaction import transaction_route
from src.routes.tokenization_energy import energyGenerated_routes

load_dotenv()

application = Flask(__name__)
CORS(application,supports_credentials=True, resources={r"/*": {"origins": "*"}}, allow_headers=["Authorization", "Content-Type"])

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
# application.register_blueprint(api_key, url_prefix='/api_key')
application.register_blueprint(users_route, url_prefix='/users')
application.register_blueprint(devices_routes, url_prefix='/devices')
application.register_blueprint(plants_routes, url_prefix='/plants')
application.register_blueprint(bucket_route, url_prefix='/upload_image')
application.register_blueprint(api_growatt_bp, url_prefix='/api_growatt')
application.register_blueprint(mercadopago_route, url_prefix='/mercadopago')
application.register_blueprint(face_route, url_prefix='/face')
application.register_blueprint(coinbase_route, url_prefix='/coinbase')
application.register_blueprint(sms_route, url_prefix='/sms')
application.register_blueprint(paypal_route, url_prefix='/paypal')
application.register_blueprint(auth_route, url_prefix='/auth')
application.register_blueprint(payments_users_route, url_prefix='/payments')
application.register_blueprint(chatbox_route, url_prefix='/chatbox')
application.register_blueprint(wallet_route, url_prefix='/wallet')
application.register_blueprint(transaction_route, url_prefix='/transaction')
application.register_blueprint(energyGenerated_routes, url_prefix='/energyGenerated')

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri, tlsAllowInvalidCertificates=True)
db = client['gaia']
collection = db['users']


@application.route('/', methods=['GET'])
def welcome():
    # application.logger.info('Se ha realizado una solicitud a la ruta principal.')
    return jsonify({'message': 'Welcome to the Gaia Server!'})

        
#durante desarrollo
if __name__ == '__main__':
    application.run(debug=True)