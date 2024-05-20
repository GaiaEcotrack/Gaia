from flask import Flask, Blueprint, jsonify, request
import requests
from pymongo import MongoClient
from src.models.user import UserSchema
from src.models.wallet_gaia import WalletGaiaSchema
import os
from dotenv import load_dotenv
from bson import ObjectId
import secrets
from werkzeug.security import check_password_hash
from bson import json_util
from flask import Response
from marshmallow import ValidationError

## middleware apikey 
from src.middlewares import require_firebase_auth
from src.services.firebase_admin.firebase_config import verify_firebase_token

load_dotenv()

application = Flask(__name__)

users_route = Blueprint('users_route', __name__)

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
        # Convertir ObjectId a cadena en la lista de dispositivos
        devices = user.get('devices')
        if devices and isinstance(devices, list):
            for device in devices:
                if '_id' in device:
                    device['_id'] = str(device['_id'])

    return jsonify({'message': 'Hello, Flask and MongoDB Atlas!', 'users': users})


@users_route.route('/<user_id>', methods=['GET'])
# @require_firebase_auth
def get_user_by_id(user_id):
    user = collection.find_one({'_id': ObjectId(user_id)})
    
    if user:
        user['_id'] = str(user['_id'])
        devices = user.get('devices')
        if devices and isinstance(devices, list):
            for device in devices:
                if '_id' in device:
                    device['_id'] = str(device['_id'])

        return jsonify({'message': 'User found', 'user': user})
    else:
        return jsonify({'message': 'User not found'}), 404
    
    # ruta para obtener usuario de firebase y llamarlo desde p2p para almacenar el mongoid en sesionstorage
# @users_route.route('/getByFirebaseUid/<firebase_uid>', methods=['GET'])
# def get_user_by_firebase_uid(firebase_uid):
#     user = collection.find_one({'firebaseUid': firebase_uid})
#     if user:
#         user['_id'] = str(user['_id'])
#         return jsonify({'message': 'User found', 'user': user})
#     else:
#         return jsonify({'message': 'User not found'}), 404


@users_route.route('/', methods=['POST'])
def add_user():
    data = request.json

    user_schema = UserSchema()
    errors = user_schema.validate(data)

    if errors:
        return jsonify({'message': 'Validation errors', 'errors': errors}), 400

    email = data.get('email')
    
    existing_user = collection.find_one({'email': email})
    if existing_user:
        return jsonify({'message': 'El correo electrónico ya está registrado'}), 400

    full_name = data.get('full_name')
    identification_number = data.get('identification_number')
    address = data.get('address')
    phone = data.get('phone')

    identity_document = data.get('identity_document')
    bank_account_status = data.get('bank_account_status')
    tax_declarations = data.get('tax_declarations')
    other_financial_documents = data.get('other_financial_documents')

    # Campos adicionales
    credentials = data.get('credentials')
    secret_key = data.get('secret_key')
    devices = data.get('devices', [])
    membresia = data.get('membresia', False)
    key_auth = ""
    verified_email = data.get('verified_email', False)
    verified_sms = data.get('verified_sms', False)
    verified_2fa = data.get('verified_2fa', False)
    status_documents = "pending"
    photo_profile = data.get('photo_profile')
    location = data.get('location')
    wallet = data.get('wallet', {})

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
        'devices': devices,
        'membresia': membresia,
        'key_auth': key_auth,
        'verified_email': verified_email,
        'verified_sms': verified_sms,
        'verified_2fa': verified_2fa,
        'status_documents': status_documents,
        'photo_profile': photo_profile,
        'location': location,
        'wallet': {
        'gaia_token_balance': 0,
        'transactions': [],
        'vara_balance': 0,
        'willing_to_sell_excess': False,
        'amount_kwh_to_sell': 0
        }
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

    result = collection.update_one({'_id': object_id}, {'$set': data})

    if result.matched_count == 0:
        return jsonify({'message': 'Usuario no encontrado'}), 404

    return jsonify({'message': 'Usuario actualizado con éxito'})


##! Ruta para modificar especificamente las propiedades de la wallet
@users_route.route('/<user_id>/wallet', methods=['PUT'])
def update_user_wallet(user_id):
    try:
        oid = ObjectId(user_id)
    except errors.InvalidId:
        return jsonify({'error': 'Formato de ID inválido'}), 400

    data = request.json
    wallet_schema = WalletGaiaSchema(partial=True)
    errors = wallet_schema.validate(data)
    if errors:
        return jsonify({'message': 'Validation errors', 'errors': errors}), 400

    user_collection = collection
    user_doc = user_collection.find_one({'_id': oid})
    if not user_doc:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    updates = {f'wallet.{k}': v for k, v in data.items()}
    update_result = user_collection.update_one({'_id': oid}, {'$set': updates})

    if update_result.modified_count == 0:
        return jsonify({'message': 'No se necesitaban actualizaciones o el usuario no tiene una wallet configurada'}), 200

    return jsonify({'message': 'Wallet actualizada correctamente'}), 200



##! get user sellers! para mostrar los users q quieren participar en el p2p
@users_route.route('/selling', methods=['GET'])
def get_sellers():
    # Filtrar usuarios que están dispuestos a vender excedente
    users = list(collection.find({"willing_to_sell_excess": True}))
    for user in users:
        user['_id'] = str(user['_id'])  # Convertir ObjectId a str para JSON serializable
    return jsonify(users)


# @users_route.route('/<id>', methods=['PUT'])
# def update_user(id):
#     try:
#         # Convertir el id a un ObjectId de MongoDB
#         object_id = ObjectId(id)
#     except:
#         return jsonify({'message': 'ID inválido'}), 400

#     # Obtener los datos del cuerpo de la petición
#     data = request.json

#     # Validar los datos con el esquema UserSchema
#     try:
#         valid_data = UserSchema().load(data)
#     except ValidationError as err:
#         return jsonify(err.messages), 400

#     # Si la validación es exitosa, proceder con la actualización
#     result = collection.update_one({'_id': object_id}, {'$set': valid_data})

#     if result.matched_count == 0:
#         return jsonify({'message': 'Usuario no encontrado'}), 404

#     return jsonify({'message': 'Usuario actualizado con éxito'}), 200

@users_route.route('/<id>', methods=['DELETE'])
def delete_user(id):
    try:
        # convertir el id a un ObjectId de MongoDB
        object_id = ObjectId(id)
    except:
        return jsonify({'message': 'ID inválido'}), 400

    result = collection.delete_one({'_id': object_id})

    if result.deleted_count == 0:
        return jsonify({'message': 'Usuario no encontrado'}), 404

    return jsonify({'message': 'Usuario eliminado con éxito'})


@users_route.route('/search', methods=['GET'])
def get_user_by_email():
    email = request.args.get('email')

    if not email:
        return jsonify({'message': 'Parámetro "email" no proporcionado'}), 400
    
    user = collection.find_one({'email': email})

    if not user:
        return jsonify({'message': 'Usuario no encontrado'}), 404

    # Convertir todos los ObjectId a cadenas antes de devolver la respuesta JSON
    user['_id'] = str(user['_id'])
    for device in user.get('devices', []):
        device['_id'] = str(device['_id'])
    
    return jsonify(user), 200

## verificar si llega el token fb del frontend 
@users_route.route('/tokenfb', methods=['POST'])
def endpoint():
    token = request.headers.get('Authorization')
    print('Token recibido en el backend:', token)
   
    if token:
       
        return jsonify({'message': 'Token recibido correctamente'}), 200
    else:
        
        return jsonify({'error': 'Token no encontrado en el encabezado de la solicitud'}), 400
 
 
# guardamos la url del archivo subido al bucket
@users_route.route('/save_url', methods=['POST'])
def guardar_url():
    data = request.json
    user_id = data.get('user_id')
    archivo_url = data.get('url')
    tipo_archivo = data.get('tipo_archivo') 
    user_id_obj = ObjectId(user_id)
    # Actualiza el campo específico basado en tipo_archivo
    campo_url = f"{tipo_archivo}"  # Construye el nombre del campo dinámicamente
    result = collection.update_one(
        {'_id': user_id_obj},
        {'$set': {campo_url: archivo_url}}
    )

    if result.modified_count > 0:
        return jsonify({'message': 'URL del archivo guardada con éxito', 'url': archivo_url}), 200
    else:
        return jsonify({'message': 'Error al guardar la URL del archivo o usuario no encontrado'}), 400   
    
    
@users_route.route('/save_url_device', methods=['POST'])
def guardar_url_device():
    data = request.json
    user_id = data.get('user_id')
    imagen_url = data.get('url')  # Cambia 'url' por el nombre del campo que contiene la URL de la imagen
    user_id_obj = ObjectId(user_id)
    result = collection.update_one(
        {'_id': user_id_obj},
        {'$set': {'devices.$[element].device.image': imagen_url}},
        array_filters=[{'element.user_id': user_id}]
    )

    if result.modified_count > 0:
        return jsonify({'message': 'URL de la imagen guardada con éxito', 'url': imagen_url}), 200
    else:
        return jsonify({'message': 'Error al guardar la URL de la imagen o usuario no encontrado'}), 400  
    
    
@users_route.route('/willing', methods=['GET'])
def get_users_willing_to_sell_excess():
    users = collection.find({'wallet.willing_to_sell_excess': True})
    user_list = []
    for user in users:
        user['_id'] = str(user['_id'])
        user_list.append(user)
    return jsonify({'users': user_list})



if __name__ == '__main__':
     application.run(debug=True)