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

@api_key.route('/generate/<user_id>', methods=['POST'])
def generate_api_key(user_id):
    try:
        # Convertir user_id de string a ObjectId
        user_id_obj = ObjectId(user_id)
        new_api_key = secrets.token_urlsafe(32)
        # Asegúrate de que estás actualizando la colección correcta
        result = db.users.update_one({"_id": user_id_obj}, {"$set": {"api_key": new_api_key}})
        
        if result.modified_count == 0:
            # Si no se actualizó ningún documento, podría ser porque el user_id no existe
            return jsonify({'message': 'User not found or API Key already xists'}), 404
        else:
            # Devolver una respuesta exitosa
            return jsonify({'message': 'API Key generated successfully', 'api_key': new_api_key}), 200
    except Exception as e:
        # Manejar cualquier otra excepción y devolver un error genérico
        return jsonify({'message': 'Error generating apiKey', 'error': str(e)}), 500
