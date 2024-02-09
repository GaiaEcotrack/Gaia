from bson.objectid import ObjectId
import secrets
from flask import Blueprint, jsonify, request
from pymongo import MongoClient
import os
from dotenv import load_dotenv


load_dotenv()


api_key = Blueprint('api_key', __name__)

# Configurar cliente de MongoDB
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri, tlsAllowInvalidCertificates=True)
db = client['gaia']  
collection = db['users']

@api_key.route('/generate', methods=['POST'])
def generate_api_keys():
    # Obtener todos los usuarios que no tienen una API Key
    users_without_api_key = collection.find({"api_key": {"$exists": False}})
    
    for user in users_without_api_key:
        new_api_key = secrets.token_urlsafe(32)  # Genera una nueva API Key
        # Actualizar el usuario con la nueva API Key
        collection.update_one(
            {"_id": user['_id']},
            {"$set": {"api_key": new_api_key}}
        )
        print(f"API Key generated for user {user['_id']}")

