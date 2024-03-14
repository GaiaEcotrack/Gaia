from functools import wraps
from flask import request, jsonify
import firebase_admin
from firebase_admin import auth

def require_firebase_auth(f):
    @wraps(f)
    def middleware_function(*args, **kwargs):
        if request.method == 'OPTIONS':
            return f(*args, **kwargs)
        print("Verificando token...") 
        # Obtener el token JWT desde los headers de la solicitud
        idToken = request.headers.get('Authorization')
        print(f"Token recibido: {idToken}")
        if not idToken or not idToken.startswith('Bearer '):
            return jsonify({'message': 'Authorization token is missing or invalid, desde es el middleware'}), 401
        
        try:
            # Extraer el token JWT sin el prefijo "Bearer "
            idToken = idToken.split('Bearer ')[1]
            # Verificar el token JWT con Firebase Admin SDK
            decoded_token = auth.verify_id_token(idToken)
            print(f"Token decodificado: {decoded_token}")
            # Aquí podrías establecer información del usuario en el contexto de la solicitud si es necesario
            # Por ejemplo: request.current_user = decoded_token
        except firebase_admin.exceptions.FirebaseError as firebase_error:
            # Manejo específico de errores de Firebase
            print(f"Error de Firebase al verificar el token: {firebase_error}")
            return jsonify({'message': 'Unauthorized', 'error': str(firebase_error)}), 401
        except Exception as e:
            # Manejo de otros errores inesperados
            print(f"Error general al verificar el token: {e}")
            return jsonify({'message': 'Unauthorized', 'error': str(e)}), 401
        
        # Si el token es válido, continuar con la ejecución de la función original
        return f(*args, **kwargs)
    return middleware_function
