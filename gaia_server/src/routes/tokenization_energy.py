from flask import Blueprint, jsonify, request
from pymongo import MongoClient
import os
from datetime import datetime
from src.models.tokenization_energy import energy_tokenization_schema

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri, tlsAllowInvalidCertificates=True)
db = client['gaia']
energy_tokenizations_collection = db['energy_tokenizations']

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
    # sample_data = {
    #     "energy_in_kilowatts": 120,
    #     "energy_tokenized_in_gaia_tokens": 150,
    #     "is_tokenized": True,
    #     "total_generated": 500,
    #     "total_consumed": 250,
    #     "total_excedent": 150,
    #     "tokenization_date": datetime.utcnow(),
    #     "user": {
    #         "user_id": "asdasdasdd",
    #         "name": "Test User Agus"
    #     }
    # }
    # try:
    #     energy_tokenizations_collection.insert_one(sample_data)
    #     return jsonify({"message": "Sample data inserted successfully"}), 201
    # except Exception as e:
    #     return jsonify({"error": "Error inserting sample data", "message": str(e)}), 500

      # Asegúrate de que la solicitud contenga JSON
   
    
    
@energyGenerated_routes.route('/ejemplo', methods=['POST'])
def insert_sample_data():
    print(request.data)
    print(request.headers)
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400
    
    data = request.get_json()
    data["tokenization_date"] = datetime.utcnow()  # Agregar la fecha de tokenización

    try:
        result = energy_tokenizations_collection.insert_one(data)
        return jsonify({"message": "Energy data stored successfully", "id": str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({"error": "Error storing energy data", "message": str(e)}), 500