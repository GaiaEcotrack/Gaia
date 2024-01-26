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
from src.routes.api_growth import api_growatt_bp
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

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

app.register_blueprint(SWAGGER_BLUEPRINT, url_prefix=SWAGGER_URL)
# Si deseas que la ruta POST /users esté disponible como tal, la definición
# en el Blueprint debe ser @users_route.route('/', methods=['POST']).
app.register_blueprint(users_route, url_prefix='/users')
app.register_blueprint(devices_routes, url_prefix='/devices')
app.register_blueprint(plants_routes, url_prefix='/plants')
app.register_blueprint(api_growatt_bp, url_prefix='/api_growatt')



mongo_uri = os.getenv("MONGO_URI")
# mongo_uri = 'mongodb+srv://gaiamongodb:84AmBlbGBNRr5CBJ@cluster0.wio4vv2.mongodb.net/?retryWrites=true&w=majority'
client = MongoClient(mongo_uri, tlsAllowInvalidCertificates=True)
if client:
    print('Db connected')

db = client['gaia']
collection = db['users']

@app.route('/', methods=['GET'])
def welcome():
    return jsonify({'message': 'Welcome to the Gaia Server!'})


# Cierra la conexión al finalizar
@app.teardown_appcontext
def close_connection(exception=None):
    pass  # No hagas nada en esta función, evita cerrar la conexión aquí

if __name__ == '__main__':
    try:
        app.run(debug=False)
    finally:
        client.close()
# app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)), debug=False)
