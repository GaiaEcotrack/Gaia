from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_swagger_ui import get_swaggerui_blueprint
# from src.routes.users import user_routes
# from src.models.user import UserSchema
import os
from dotenv import load_dotenv
# from src.routes.users import users_blueprint
from src.routes.users import users_route
from src.routes.devices import devices_routes
from src.routes.plants import plants_routes
from src.services.s3_bucket import bucket_route
from src.routes.api_growth import api_growatt_bp
from src.routes.mercadopago import mercadopago_route
from src.routes.coinbase import coinbase_route
# from src.routes.face import face_route
from src.routes.sms import sms_route
from flask_cors import CORS
# from src.routes.Lambda_pruebas import lambda_route 
from src.routes.paypal import paypal_route
from src.routes.authenticator import auth_route
from src.routes.payments_users import payments_users_route
from src.routes.chatbox import chatbox_route
from src.routes.wallet_gaia import wallet_route
from src.routes.transaction import transaction_route


# rutas dynamo
# from src.routes.dynamoDb import users_routes_dynamo

load_dotenv()

application = Flask(__name__)
CORS(application)

# Configuración de Swagger
SWAGGER_URL = "/docs"
API_URL = "/static/swagger.json"
SWAGGER_BLUEPRINT = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        "app_name": "Gaia API"
    }
)

application.config['MERCADOPAGO_PUBLIC_KEY'] = os.getenv('MERCADOPAGO_PUBLIC_KEY')
application.config['MERCADOPAGO_ACCESS_TOKEN'] = os.getenv('MERCADOPAGO_ACCESS_TOKEN')

application.register_blueprint(SWAGGER_BLUEPRINT, url_prefix=SWAGGER_URL)
# Si deseas que la ruta POST /users esté disponible como tal, la definición
# en el Blueprint debe ser @users_route.route('/', methods=['POST']).
application.register_blueprint(users_route, url_prefix='/users')
application.register_blueprint(devices_routes, url_prefix='/devices')
application.register_blueprint(plants_routes, url_prefix='/plants')
application.register_blueprint(bucket_route, url_prefix='/upload_image')
application.register_blueprint(mercadopago_route, url_prefix='/mercadopago')
application.register_blueprint(api_growatt_bp, url_prefix='/api_growatt')
application.register_blueprint(coinbase_route, url_prefix='/coinbase')
# app.register_blueprint(face_route, url_prefix='/face')
application.register_blueprint(sms_route, url_prefix='/sms')
# app.register_blueprint(lambda_route, url_prefix='/lambda')
application.register_blueprint(paypal_route, url_prefix='/paypal')
application.register_blueprint(auth_route, url_prefix='/auth')
application.register_blueprint(payments_users_route, url_prefix='/payments')
application.register_blueprint(chatbox_route, url_prefix='/chatbox')
application.register_blueprint(wallet_route, url_prefix='/wallet')
application.register_blueprint(transaction_route, url_prefix='/transaction')

# dynamo routes
# app.register_blueprint(users_routes_dynamo, url_prefix='/dynamo')



mongo_uri = os.getenv("MONGO_URI")
# mongo_uri = 'mongodb+srv://gaiamongodb:84AmBlbGBNRr5CBJ@cluster0.wio4vv2.mongodb.net/?retryWrites=true&w=majority'
client = MongoClient(mongo_uri, tlsAllowInvalidCertificates=True)
if client:
    print('Db connected')

db = client['gaia']
collection = db['users']

@application.route('/', methods=['GET'])
def welcome():
    return jsonify({'message': 'Welcome to the Gaia Server!'})


# Cierra la conexión al finalizar
@application.teardown_appcontext
def close_connection(exception=None):
    pass  # No hagas nada en esta función, evita cerrar la conexión aquí

if __name__ == '__main__':
    try:
        application.run(debug=False)
    finally:
        client.close()
# app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)), debug=False)


