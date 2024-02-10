from functools import wraps
from flask import request, jsonify
import firebase_admin
from firebase_admin import auth

def require_firebase_auth(f):
    @wraps(f)
    def middleware_function(*args, **kwargs):
        # Obtener el token JWT desde los headers de la solicitud
        id_token = request.headers.get('Authorization')
        if not id_token or not id_token.startswith('Bearer '):
            return jsonify({'message': 'Authorization token is missing or invalid'}), 401
        
        try:
            # Extraer el token JWT sin el prefijo "Bearer "
            id_token = id_token.split('Bearer ')[1]
            # Verificar el token JWT con Firebase Admin SDK
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid']
            # Aquí puedes opcionalmente buscar al usuario en tu base de datos por su UID
            # y realizar cualquier otra verificación o logística necesaria
        except Exception as e:
            # Si la verificación falla, rechazar la solicitud
            return jsonify({'message': 'Unauthorized', 'error': str(e)}), 401
        
        # Si el token es válido, continuar con la ejecución de la función original
        return f(*args, **kwargs)
    return middleware_function
