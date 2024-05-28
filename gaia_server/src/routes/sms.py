import os
from twilio.rest import Client
from flask import Flask, request, jsonify, Blueprint
from src.routes.users import collection
from bson import ObjectId

application = Flask(__name__)
sms_route = Blueprint('sms', __name__)

# Read more at http://twil.io/secure
account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
verify_sid = "VA42ee565aa2f0e6c3329eda1588a36df0"

client = Client(account_sid, auth_token)

def send_otp(phone_number):
    try:
        verification = client.verify.v2.services(verify_sid) \
            .verifications \
            .create(to=phone_number, channel="sms")
        print(verification.status)
        return True
    except Exception as e:
        print(f"Error sending OTP: {str(e)}")
        return False

def verify_otp(phone_number, otp_code):
    try:
        verification_check = client.verify.v2.services(verify_sid) \
            .verification_checks \
            .create(to=phone_number, code=otp_code)
        print(verification_check.status)
        return verification_check.status == 'approved'
    except Exception as e:
        print(f"Error verifying OTP: {str(e)}")
        return False

@sms_route.route('/send-otp', methods=['POST'])
def handle_send_otp():
    try:
        data = request.json
        phone_number = data.get('phone_number')

        if not phone_number:
            return jsonify({'error': 'Número de teléfono no proporcionado'}), 400
        if send_otp(phone_number):
            return jsonify({'success': True}), 200
        else:
            return jsonify({'error': 'Error al enviar el código OTP'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sms_route.route('/verify-otp', methods=['POST'])
def handle_verify_otp():
    try:
        data = request.json
        phone_number = data.get('phone_number')
        otp_code = data.get('otp_code')
        user_id = data.get('id')
        
        existing_user = collection.find_one({"_id": ObjectId(user_id)})
        
        if existing_user:            
            if not phone_number or not otp_code:
                return jsonify({'error': 'Número de teléfono o código OTP no proporcionado'}), 400
            if verify_otp(phone_number, otp_code):
                # Actualiza la propiedad 'verified_sms' en la base de datos
                collection.update_one(
                    {"_id": ObjectId(user_id)},
                    {"$set": {"verified_sms": True}}
                )
                return jsonify({'success': True}), 200
            else:
                return jsonify({'error': 'Código OTP incorrecto'}), 401
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    application.run(debug=True)