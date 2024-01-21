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

load_dotenv()

application = Flask(__name__)

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

application.register_blueprint(SWAGGER_BLUEPRINT, url_prefix=SWAGGER_URL)
# Si deseas que la ruta POST /users esté disponible como tal, la definición
# en el Blueprint debe ser @users_route.route('/', methods=['POST']).
application.register_blueprint(users_route, url_prefix='/users')
application.register_blueprint(devices_routes, url_prefix='/devices')



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
        application.run(debug=True)
    finally:
        client.close()