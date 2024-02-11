# from bson.objectid import ObjectId
# import secrets
# from flask import Blueprint, jsonify, request
# from pymongo import MongoClient
# import os
# from dotenv import load_dotenv


# load_dotenv()


# api_key = Blueprint('api_key', __name__)

# # Configurar cliente de MongoDB
# mongo_uri = os.getenv("MONGO_URI")
# client = MongoClient(mongo_uri, tlsAllowInvalidCertificates=True)
# db = client['gaia']  
# collection = db['users']

# @api_key.route('/generate', methods=['POST'])
# def generate_api_keys():
#     # Obtener todos los usuarios que no tienen una API Key
#     users_without_api_key = collection.find({"api_key": {"$exists": False}})
#     count = 0  # Contador para llevar la cuenta de cuántos usuarios se actualizan
    
#     for user in users_without_api_key:
#         new_api_key = secrets.token_urlsafe(32)  # Genera una nueva API Key
#         # Actualizar el usuario con la nueva API Key
#         result = collection.update_one(
#             {"_id": user['_id']},
#             {"$set": {"api_key": new_api_key}}
#         )
#         if result.modified_count > 0:
#             print(f"API Key generated for user {user['_id']}")
#             count += 1  # Incrementa el contador solo si el usuario se actualizó correctamente
    
#     # Devolver una respuesta indicando cuántos usuarios fueron actualizados
#     return jsonify({'message': f'API Keys generated for {count} users'}), 200

# ## * authenticate url for api key users
