from flask import Blueprint, request, jsonify
from src.models.wallet_gaia import WalletGaiaSchema
import os
from pymongo import MongoClient
from bson import ObjectId

wallet_route = Blueprint('wallet_route', __name__)

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri, tlsAllowInvalidCertificates=True)
if client:
    print('Db connected')

db = client['gaia']
wallet_collection = db['wallet']
collection = db['users']

@wallet_route.route('/', methods=['POST'])
def add_wallet_to_user():
    try:
        user_id = request.json['user_id']
        wallet_data = request.json['wallet']

        wallet_schema = WalletGaiaSchema()
        wallet_object = wallet_schema.load(wallet_data)

        user_collection = collection  
        user = user_collection.find_one({'_id': ObjectId(user_id)})

        if user:
            # Verificar si la propiedad wallet ya está presente en el usuario
            if 'wallet' not in user:
                user['wallet'] = {}  # Crear un objeto wallet vacío si no existe

            # Copiar las propiedades de wallet_object a user['wallet']
            for key, value in wallet_object.items():
                user['wallet'][key] = value

            # Actualizar la propiedad wallet directamente en el usuario
            user_collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': {'wallet': user['wallet']}}
            )
            # Convertir el ObjectId del usuario a cadena antes de enviar la respuesta JSON
            user['_id'] = str(user['_id'])
            return jsonify({'message': 'Wallet created and added successfully'}), 200
        else:
            return jsonify({'message': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
      
      
# Ejemplo de documento JSON para creacion de wallet con valores..

# {
#   "user_id": "<idDelUsuario>",
#   "wallet": {
#     "vara_balance": 0.0,
#     "gaia_token_balance": 0.0,
#     "willing_to_sell_excess": true,
#     "transactions": [],
#     "amount_kwh_to_sell": 0
#   }
# }


@wallet_route.route('/<user_id>', methods=['PUT'])
def update_wallet(user_id):
    try:
        data = request.json
        amount_kwh_to_sell = data.get('amount_kwh_to_sell')
        if amount_kwh_to_sell is None:
            return jsonify({'message': 'Se requiere el valor de "amount_kwh_to_sell" en el cuerpo de la solicitud'}), 400
        
        user_collection = collection  
        user = user_collection.find_one({'_id': ObjectId(user_id)})

        if user:
            # Verificar si la propiedad wallet ya está presente en el usuario
            if 'wallet' not in user:
                user['wallet'] = {}  # Crear un objeto wallet vacío si no existe

            # Actualizar las propiedades de la billetera
            user['wallet']['willing_to_sell_excess'] = True
            user['wallet']['amount_kwh_to_sell'] = amount_kwh_to_sell

            # Actualizar la propiedad wallet directamente en el usuario
            user_collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': {'wallet': user['wallet']}}
            )
            # Convertir el ObjectId del usuario a cadena antes de enviar la respuesta JSON
            user['_id'] = str(user['_id'])
            return jsonify({'message': 'Billetera actualizada con éxito', 'user_id': str(user_id)}), 200
        else:
            return jsonify({'message': 'Usuario no encontrado'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# ejemplo de Body para la peticion
    
# {
# 	"amount_kwh_to_sell": 20   // valor kWh. (dentro del rango disponible para vender con base en la energia excedente) 
# }

# Nota: la propiedad "willing_to_sell_excess" cambia automaticamente a true



