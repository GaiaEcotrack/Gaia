from flask import Flask, Blueprint, jsonify, request
import requests
from pymongo import MongoClient
from src.models.user import UserSchema
import os
from dotenv import load_dotenv
from bson import ObjectId
import secrets
from werkzeug.security import check_password_hash
from bson import json_util
from flask import Response

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

    result = collection.update_one({'_id': object_id}, {'$set': data})

    if result.matched_count == 0:
        return jsonify({'message': 'Usuario no encontrado'}), 404

    return jsonify({'message': 'Usuario actualizado con éxito'})


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
    
    return jsonify(user)

## verificar si llega el token fb del frontend 
@users_route.route('/tokenfb', methods=['POST'])
def endpoint():
    token = request.headers.get('Authorization')
    print('Token recibido en el backend:', token)
   
    if token:
       
        return jsonify({'message': 'Token recibido correctamente'}), 200
    else:
        
        return jsonify({'error': 'Token no encontrado en el encabezado de la solicitud'}), 400

@users_route.route('/paypal/transaction', methods=['POST'])
def save_paypal_transaction():
    data = request.json
    print('Datos de transacción recibidos:', data)

    # Verificar si 'payer' está presente en los datos
    if 'payerId' not in data or 'orderId' not in data or 'paymentId' not in data or 'totalValue' not in data or 'invoice' not in data:
        return jsonify({'error': 'Datos de transacción de PayPal incompletos'}), 400

    # Extraer los datos relevantes de la transacción
    orderId = data.get('orderId')
    payerId = data.get('payerId')
    paymentId = data.get('paymentId')
    totalValue = data.get('totalValue')
    invoice = data.get('invoice')

    # Guardar los datos en la base de datos MongoDB Atlas
    transaction_data = {
        'orderId': orderId,
        'payerId': payerId,
        'paymentId': paymentId,
        'totalValue': totalValue,
        'invoice': invoice
    }

    result = collection.insert_one(transaction_data)
    inserted_id = result.inserted_id

    return jsonify({'message': 'Transacción de PayPal guardada correctamente', 'transaction_id': str(inserted_id)})


@users_route.route('/paypal/transactions', methods=['GET'])
def get_paypal_transactions():
    transactions = collection.find({}, {'_id': False, 'orderId': True, 'payerId': True, 'paymentId': True, 'totalValue': True, 'invoice': True})
    # Convertir las transacciones a una lista para jsonify
    transactions_list = []
    for transaction in transactions:
        transactions_list.append(transaction)
    return jsonify({'transactions': transactions_list})

if __name__ == '__main__':
    application.run(debug=True)