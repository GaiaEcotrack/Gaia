import pyotp
import os
import qrcode
from flask import Flask, request, jsonify, Blueprint
from marshmallow import ValidationError
from pymongo import MongoClient
from src.models.user import UserSchema
from bson import ObjectId
from io import BytesIO
import base64

application = Flask(__name__)
auth_route = Blueprint('auth', __name__)

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri, tlsAllowInvalidCertificates=True)
if client:
    print('Conexión a la base de datos exitosa')

db = client['gaia']
collection = db['users']

@auth_route.route('/generate_key', methods=['POST'])
def generate_key_and_qr():
    try:
        user_data = request.get_json()
        user_id = user_data.get('id')
        existing_user = collection.find_one({"_id": ObjectId(user_id)})

        if existing_user:
            # Actualiza la propiedad key_auth del usuario con el nuevo valor
            existing_user['key_auth'] = pyotp.random_base32()
            
            # Guarda los cambios en la base de datos
            collection.update_one({"_id": ObjectId(user_id)}, {"$set": {"key_auth": existing_user['key_auth']}})
            
            # Convierte el ObjectId a cadena antes de incluirlo en el objeto JSON
            user_id_str = str(existing_user['_id'])
            
            # Genera el URI con el email actual del usuario (o con el que prefieras)
            uri = pyotp.totp.TOTP(existing_user['key_auth']).provisioning_uri(name=existing_user.get('email', 'default_email'), issuer_name="GaiaEcoTrack App")

            # Genera el código QR y convierte la imagen a Base64
            qr_image = qrcode.make(uri)
            buffered = BytesIO()
            qr_image.save(buffered, format="PNG")
            qr_image_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

            user_json = {"_id": user_id_str, "key_auth": existing_user['key_auth'], "qr_image": qr_image_base64}

            return jsonify({"message": "Key and QR code generated successfully", "user": user_json}), 200
        else:
            return jsonify({"error": "User not found"}), 404

    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
      
@auth_route.route('/verify_otp', methods=['POST'])
def verify_otp():
    try:
        data = request.get_json()
        user_id = data.get('id')
        user_otp = data.get('otp')

        # Obtén el usuario de la base de datos
        existing_user = collection.find_one({"_id": ObjectId(user_id)})

        if existing_user:
            # Crea un objeto TOTP con la clave del usuario
            totp = pyotp.TOTP(existing_user['key_auth'])

            # Verifica el código OTP ingresado
            if totp.verify(user_otp):
                return jsonify({"message": "OTP verification successful"}), 200
            else:
                return jsonify({"error": "Invalid OTP"}), 400
        else:
            return jsonify({"error": "User not found"}), 404

    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
      
if __name__ == '__main__':
    application.run(debug=True)