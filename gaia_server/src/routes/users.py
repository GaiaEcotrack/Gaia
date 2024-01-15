
# Bluepirnt 
# permite organizar y estructurar tu aplicación de manera modular. Puedes pensar en un Blueprint como un conjunto de rutas, 
# controladores y recursos que se pueden registrar y luego incorporar en tu aplicación principal.
# Cuando importas Blueprint desde Flask, puedes crear instancias de esta clase para definir grupos lógicos de rutas y 
# funciones de vista. Estos blueprints se pueden registrar en tu aplicación principal posteriormente.

from flask import Blueprint, jsonify, request
from pymongo import MongoClient
from bson import ObjectId

user_routes = Blueprint('user_routes', __name__)

# Conexión a MongoDB y configuración de la colección 'users' (código omitido por brevedad)
mongo_uri = 'mongodb+srv://gaiamongodb:84AmBlbGBNRr5CBJ@cluster0.wio4vv2.mongodb.net/?retryWrites=true&w=majority'
client = MongoClient(mongo_uri, tlsAllowInvalidCertificates=True)
if client:
    print('Db connected')

db = client['gaia']
collection = db['users']

@user_routes.route('/users', methods=['POST'])
def add_user():
    try:
        # Obtener datos del cuerpo de la solicitud
        data = request.get_json()

        # Verificar si los campos necesarios están presentes
        required_fields = ['username', 'email', 'password']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Campos faltantes en la solicitud'}), 400

        # Crear un nuevo usuario
        new_user = {
            'username': data['username'],
            'email': data['email'],
            'password': data['password']
        }

        # Insertar el nuevo usuario en la base de datos
        result = collection.insert_one(new_user)
        inserted_id = result.inserted_id

        return jsonify({'message': 'Usuario agregado correctamente!', 'user_id': str(inserted_id)}), 201
    except Exception as e:
        print(f"Error al insertar el usuario: {e}")
        return jsonify({'error': str(e)}), 500
