import os
from twilio.rest import Client
from flask import Flask, request, jsonify, Blueprint

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
    
def check_verification_status(phone_number):
    try:
        verification_check = client.verify.v2.services(verify_sid) \
            .verification_checks \
            .create(to=phone_number)
        print(verification_check.status)
        return verification_check.status == 'approved'
    except Exception as e:
        print(f"Error checking verification status: {str(e)}")
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

        if not phone_number or not otp_code:
            return jsonify({'error': 'Número de teléfono o código OTP no proporcionado'}), 400
        if verify_otp(phone_number, otp_code):
            return jsonify({'success': True}), 200
        else:
            return jsonify({'error': 'Código OTP incorrecto'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@sms_route.route('/check', methods=['POST'])
def handle_check_verification():
    try:
        data = request.json
        phone_number = data.get('phone_number')

        if not phone_number:
            return jsonify({'error': 'Número de teléfono no proporcionado'}), 400

        if check_verification_status(phone_number):
            return jsonify({'success': True}), 200
        else:
            return jsonify({'error': 'Número de teléfono no verificado'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    application.run(debug=True)