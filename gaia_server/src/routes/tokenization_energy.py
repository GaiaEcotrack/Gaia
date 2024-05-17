from flask import Blueprint, jsonify, request
from pymongo import MongoClient
import os
from datetime import datetime
from src.models.tokenization_energy import energy_tokenization_schema
from src.models.user import UserSchema
from bson import ObjectId
from apscheduler.schedulers.background import BackgroundScheduler
import requests


mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri, tlsAllowInvalidCertificates=True)
db = client['gaia']
energy_tokenizations_collection = db['energy_tokenizations']
users_collection = db['users']

energyGenerated_routes = Blueprint('energyGenerated', __name__)

@energyGenerated_routes.route('/', methods=['GET'])
def get_tokenizations():
    try:
        tokenizations = list(energy_tokenizations_collection.find({}))
        # print("Tokenization: ", tokenizations)
        if not tokenizations:
            return jsonify({'message': 'No energy tokenization data found'}), 404

        # Serializar los datos de tokenización utilizando Marshmallow
        result = energy_tokenization_schema.dump(tokenizations, many=True)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': 'Server error', 'message': str(e)}), 500
    
    
    
# @energyGenerated_routes.route('/ejemplo', methods=['POST'])
# def insert_sample_data():
#     sample_data = {
#         "energy_in_kilowatts": 111120,
#         "energy_tokenized_in_gaia_tokens": 150,
#         "is_tokenized": True,
#         "total_generated": 500,
#         "total_consumed": 250,
#         "total_excedent": 150,
#         "tokenization_date": datetime.utcnow(),
#         "user": {
#             "user_id": "asdasdasdd",
#             "name": "T11111111gus"
#         }
#     }
#     try:
#         energy_tokenizations_collection.insert_one(sample_data)
#         return jsonify({"message": "Sample data inserted successfully"}), 201
#     except Exception as e:
#         return jsonify({"error": "Error inserting sample data", "message": str(e)}), 500

      # Asegúrate de que la solicitud contenga JSON
   
    
    
@energyGenerated_routes.route('/<user_id>/energy', methods=['PUT'])
def update_user_energy(user_id):
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400
    
    data = request.get_json()
    
    # Validar los datos con Marshmallow
    errors = energy_tokenization_schema.validate(data)
    if errors:
        return jsonify({"errors": errors}), 400
    
    # Agregar la fecha de tokenización si no está presente
    if "tokenization_date" not in data:
        data["tokenization_date"] = datetime.utcnow()
    
    try:
        # Verificar si el usuario existe
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Insertar datos de energía con referencia al usuario
        energy_result = energy_tokenizations_collection.insert_one(data)
        
        # Actualizar el usuario para incluir la nueva tokenización de energía
        users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$push": {"energy_tokenizations": {
                "energy_in_kilowatts": data["energy_in_kilowatts"],
                "energy_tokenized_in_gaia_tokens": data["energy_tokenized_in_gaia_tokens"],
                "is_tokenized": data["is_tokenized"],
                "total_generated": data["total_generated"],
                "total_consumed": data["total_consumed"],
                "total_excedent": data["total_excedent"],
                "tokenization_date": data["tokenization_date"]
            }}}
        )
        
        return jsonify({"message": "Energy data stored successfully", "id": str(energy_result.inserted_id)}), 201
    except Exception as e:
        return jsonify({"error": "Error storing energy data", "message": str(e)}), 500
    
    ## id del usuario para obtener los datos de su energia
@energyGenerated_routes.route('/<user_id>/energy', methods=['GET'])
def get_user_energy(user_id):
    try:
        user = users_collection.find_one({"_id": user_id})
        if not user:
            return jsonify({"error": "User not found"}), 404

        energy_data = list(energy_tokenizations_collection.find({"user.user_id": user_id}))
        user["energy_tokenizations"] = energy_data

        return jsonify(user), 200
    except Exception as e:
        return jsonify({"error": "Server error", "message": str(e)}), 500
    
# def send_energy_data():
#     # Obtener todos los usuarios
#     users = users_collection.find()
#     for user in users:
#         user_id = str(user['_id'])
#         # Construir los datos que se enviarán
#         data = {
#             "energy_in_kilowatts": "",  # Estos son hardcodeados, modificar a valores reales.
#             "energy_tokenized_in_gaia_tokens": "",
#             "is_tokenized": True,
#             "total_generated": "",
#             "total_consumed": "",
#             "total_excedent": "",
#             "tokenization_date": datetime.utcnow().isoformat()
#         }
#         # Enviar la solicitud PUT a la API
#         response = requests.put(f'http://127.0.0.1:5000/energyGenerated/{user_id}/energy', json=data)
#         print(f'Updated energy data for user {user_id}: {response.status_code}')

# Configurar el programador
# scheduler = BackgroundScheduler()
# scheduler.add_job(send_energy_data, 'cron', hour=0, minute=13)
# scheduler.start()