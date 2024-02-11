
from flask import Flask, Blueprint, jsonify, request
import requests
from pymongo import MongoClient
from src.models.user import UserSchema
import os
from dotenv import load_dotenv
from bson import ObjectId
import secrets
from werkzeug.security import check_password_hash

## middleware apikey
from src.middlewares import require_firebase_auth
from src.services.firebase_admin.firebase_config import verify_firebase_token



load_dotenv()

application = Flask(__name__)

users_route = Blueprint('users_route', __name__)

# Obtener la URI de MongoDB de las variables de entorno
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri, tlsAllowInvalidCertificates=True)
if client:
    print('Db connected')

db = client['gaia']
collection = db['users']

# RUTEO
@users_route.route('/', methods=['GET'])
# @require_firebase_auth
def get_users():
    users = list(collection.find())
    for user in users:
        user['_id'] = str(user['_id'])
    return jsonify({'message': 'Hello, Flask and MongoDB Atlas!', 'users': users})

# ruta users deploy
# @users_route.route('/', methods=['GET'])
# def get_users():
#     # URL del servidor remoto que proporciona los datos de los usuarios
#     remote_server_url = "https://dev-server-2xe8.onrender.com/users"  # Reemplaza con la URL correcta
    
#     try:
#         # Realiza una solicitud GET al servidor remoto
#         response = requests.get(remote_server_url)
        
#         # Verifica si la solicitud fue exitosa (código de estado 200)
#         if response.status_code == 200:
#             # Parsea los datos JSON de la respuesta
#             users = response.json()['users']
            
#             # Modifica los datos según sea necesario
            
#             return jsonify({'message': 'Usuarios obtenidos desde el servidor remoto', 'users': users})
#         else:
#             return jsonify({'error': 'Error al obtener usuarios desde el servidor remoto'})
#     except Exception as e:
#         return jsonify({'error': 'Error de conexión con el servidor remoto', 'details': str(e)})

@users_route.route('/<id>', methods=['GET'])
def get_user_by_id(id):
    try:
        # Convertir el id a un ObjectId de MongoDB
        object_id = ObjectId(id)
    except:
        return jsonify({'message': 'ID inválido'}), 400

    # Buscar el usuario en la base de datos
    user = collection.find_one({'_id': object_id})

    if not user:
        return jsonify({'message': 'Usuario no encontrado'}), 404

    # Convertir el ObjectId a string para la respuesta JSON
    user['_id'] = str(user['_id'])
    return jsonify(user)
@users_route.route('/', methods=['POST'])
def add_user():
    data = request.json

    user_schema = UserSchema()
    errors = user_schema.validate(data)

    if errors:
        return jsonify({'message': 'Validation errors', 'errors': errors}), 400

    # username = data.get('username')
    email = data.get('email')
    # password = data.get('password')

    # Obtener los nuevos campos
    full_name = data.get('full_name')
    identification_number = data.get('identification_number')
    address = data.get('address')
    phone = data.get('phone')

    identity_document = data.get('identity_document')
    # birth_certificate = data.get('birth_certificate')
    # marriage_certificate = data.get('marriage_certificate')

    bank_account_status = data.get('bank_account_status')
    tax_declarations = data.get('tax_declarations')
    other_financial_documents = data.get('other_financial_documents')

    # Campos adicionales
    credentials = data.get('credentials')
    secret_key = data.get('secret_key')
    devices = data.get('devices', [])

    # Insertar el nuevo usuario en la colección
    new_user = {
        'email': email,
        'full_name': full_name,
        'identification_number': identification_number,
        'address': address,
        'phone': phone,
        'identity_document': identity_document,
        'bank_account_status': bank_account_status,
        'tax_declarations': tax_declarations,
        'other_financial_documents': other_financial_documents,
        'credentials': credentials,
        'secret_key': secret_key,
        'devices': devices
    }

    result = collection.insert_one(new_user)
    inserted_id = result.inserted_id

    return jsonify({'message': 'Usuario agregado con éxito', 'user_id': str(inserted_id)})

@users_route.route('/<id>', methods=['PUT'])
def update_user(id):
    try:
        # Convertir el id a un ObjectId de MongoDB
        object_id = ObjectId(id)
    except:
        return jsonify({'message': 'ID inválido'}), 400

    data = request.json
    # Aquí puedes agregar validación para los datos si es necesario

    # Actualizar el usuario en la base de datos
    result = collection.update_one({'_id': object_id}, {'$set': data})

    if result.matched_count == 0:
        return jsonify({'message': 'Usuario no encontrado'}), 404

    return jsonify({'message': 'Usuario actualizado con éxito'})

@users_route.route('/<id>', methods=['DELETE'])
def delete_user(id):
    try:
        # Convertir el id a un ObjectId de MongoDB
        object_id = ObjectId(id)
    except:
        return jsonify({'message': 'ID inválido'}), 400

    # Eliminar el usuario de la base de datos
    result = collection.delete_one({'_id': object_id})

    if result.deleted_count == 0:
        return jsonify({'message': 'Usuario no encontrado'}), 404

    return jsonify({'message': 'Usuario eliminado con éxito'})

if __name__ == '__main__':
    application.run(debug=True)
    
@users_route.route('/search', methods=['GET'])
def get_user_by_email():
    email = request.args.get('email')

    if not email:
        return jsonify({'message': 'Parámetro "email" no proporcionado'}), 400
    user = collection.find_one({'email': email})

    if not user:
        return jsonify({'message': 'Usuario no encontrado'}), 404

    user['_id'] = str(user['_id'])
    return jsonify(user)

## verificar si llega el token fb del frontend 
@users_route.route('/tokenfb', methods=['POST'])
def endpoint():
    token = request.headers.get('Authorization')
    print('Token recibido en el backend:', token)
     # Verificar si el token está presente
    if token:
        # Si el token está presente, devolver una respuesta 200 OK con un mensaje
        return jsonify({'message': 'Token recibido correctamente'}), 200
    else:
        # Si el token no está presente, devolver una respuesta 400 Bad Request con un mensaje de error
        return jsonify({'error': 'Token no encontrado en el encabezado de la solicitud'}), 400


## por el momento no al necesitamos
# @users_route.route('/save_url', methods=['POST'])
# def guardar_url():
#     data = request.json
#     user_id = data.get('user_id')
#     archivo_url = data.get('url')
#     tipo_archivo = data.get('tipo_archivo')  # Ejemplo: 'identity_document', 'bank_account_status', etc.

#     # Asegúrate de validar user_id, archivo_url y tipo_archivo aquí

#     user_id_obj = ObjectId(user_id)
#     # Actualiza el campo específico basado en tipo_archivo
#     campo_url = f"{tipo_archivo}_url"  # Construye el nombre del campo dinámicamente
#     result = collection.update_one(
#         {'_id': user_id_obj},
#         {'$set': {campo_url: archivo_url}}
#     )

#     if result.modified_count > 0:
#         return jsonify({'message': 'URL del archivo guardada con éxito'}), 200
#     else:
#         # Podrías querer verificar si el usuario no existe y devolver un mensaje específico
#         return jsonify({'message': 'Error al guardar la URL del archivo o usuario no encontrado'}), 400
    
    
