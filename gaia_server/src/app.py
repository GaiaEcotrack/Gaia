from flask import Flask, jsonify
from pymongo import MongoClient
from bson import ObjectId  # Importa ObjectId
from flask_swagger_ui import get_swaggerui_blueprint
from routes.users import user_routes

app = Flask(__name__)

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

mongo_uri = 'mongodb+srv://gaiamongodb:84AmBlbGBNRr5CBJ@cluster0.wio4vv2.mongodb.net/?retryWrites=true&w=majority'
client = MongoClient(mongo_uri, tlsAllowInvalidCertificates=True)
if client:
    print('Db connected')

db = client['gaia']
collection = db['users']

#  Inserta un documento de ejemplo en la colección "users"
# example_user = {
#     'username': 'ejemplo_usuario',
#     'email': 'usuario@example.com',
#     'password': 'contraseña_secreta'
# }

# try:
#     result = collection.insert_one(example_user)
#     inserted_id = result.inserted_id
#     print(f"Documento insertado exitosamente con ID: {inserted_id}")
# except Exception as e:
#     print(f"Error al insertar el documento: {e}")

# Ruta principal
@app.route('/')
def hello():
    # Recupera todos los documentos de la colección "users"
    users = list(collection.find())

    # Convierte ObjectId a str para hacerlo JSON serializable
    for user in users:
        user['_id'] = str(user['_id'])

    return jsonify({'message': 'Hello, Flask and MongoDB Atlas!', 'users': users})

# Cierra la conexión al finalizar
@app.teardown_appcontext
def close_connection(exception=None):
    client.close()
  
# Registra las rutas definidas en el módulo user_routes
app.register_blueprint(user_routes)
    

if __name__ == '__main__':
    app.run(debug=True)
