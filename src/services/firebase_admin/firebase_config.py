# firebase_config.py
import os
import firebase_admin
from firebase_admin import credentials, auth

# Inicializa Firebase Admin con tu archivo de credenciales
def initialize_firebase_app():
    cred_path = "src/firebase-adminsdk.json"
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

# Verifica el token JWT y devuelve el UID del usuario
def verify_firebase_token(token):
    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        return uid
    except Exception as e:
        print(e)
        return None

# Llama a initialize_firebase_app() al importar el archivo para asegurarte de que Firebase Admin se inicialice
initialize_firebase_app()