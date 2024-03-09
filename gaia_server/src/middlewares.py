from functools import wraps
from flask import request, jsonify

from firebase_admin import auth

def require_firebase_auth(f):
    @wraps(f)
    def middleware_function(*args, **kwargs):
        print("Verificando token...") 
        # Obtener el token JWT desde los headers de la solicitud
        idToken = request.headers.get('Authorization')
        print(f"Token recibido: {idToken}")
        if not idToken or not idToken.startswith('Bearer '):
            return jsonify({'message': 'Authorization token is missing or invalid'}), 401
        
        try:
            # Extraer el token JWT sin el prefijo "Bearer "
            idToken = idToken.split('Bearer ')[1]
            # Verificar el token JWT con Firebase Admin SDK
            decoded_token = auth.verify_id_token(idToken)
            print(decoded_token)
            uid = decoded_token['uid']
        
        except Exception as e:

            return jsonify({'message': 'Unauthorized', 'error': str(e)}), 401
        
        # Si el token es válido, continuar con la ejecución de la función original
        return f(*args, **kwargs)
    return middleware_function
